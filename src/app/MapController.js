define([
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/Color',

    'dojo/dom-construct',

    'dojo/topic',

    'esri/InfoTemplate',
    'esri/graphic',
    'esri/lang',

    'esri/dijit/InfoWindowLite',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',

    'esri/symbols/SimpleLineSymbol',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    './config'
], function(
    lang,
    array,
    Color,

    domConstruct,

    topic,

    InfoTemplate,
    Graphic,
    esriLang,

    InfoWindow,

    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    FeatureLayer,

    LineSymbol,

    BaseMap,
    BaseMapSelector,

    config
) {
    return {
        // description:
        //      Handles interaction between app widgets and the map. Mostly through pub/sub

        // handles: Object[]
        //      container to track handles for this object
        handles: [],

        // childWidgets: array
        // summary:
        //      holds child widgets 
        childWidgets: null,

        // Properties to be sent into constructor
        // map: agrc/widgets/map/BaseMap
        map: null,

        init: function(params) {
            // summary:
            //      description
            console.log('app.MapController::init', arguments);

            lang.mixin(this, params);

            this.childWidgets = [];

            this.map = new BaseMap(this.mapDiv, {
                defaultBaseMap: 'Lite'
            });

            var infoWindow = new InfoWindow(null,
                domConstruct.create('div', null, null, this.map.root));

            this.map.setInfoWindow(infoWindow);

            this.symbol = new LineSymbol(LineSymbol.STYLE_SOLID, new Color('#F012BE'), 3);

            this.childWidgets.push(
                infoWindow,
                new BaseMapSelector({
                    map: this.map,
                    id: 'claro',
                    position: 'TR'
                }));

            this.layers = [];

            this.setUpSubscribes();
        },
        setUpSubscribes: function() {
            // summary:
            //      subscribes to topics
            console.log('app.MapController::setUpSubscribes', arguments);

            this.handles.push(
                topic.subscribe(config.topics.map.enableLayer,
                    lang.hitch(this, 'addLayerAndMakeVisible')),
                topic.subscribe(config.topics.map.layerOpacity,
                    lang.hitch(this, 'updateOpacity'))
            );
        },
        addLayerAndMakeVisible: function(props) {
            // summary:
            //      description
            // props: object
            //  { url, serviceType, layerIndex, layerProps }
            console.log('app.MapController::addLayerAndMakeVisible', arguments);

            // check to see if layer has already been added to the map
            var lyr;
            var alreadyAdded = array.some(this.map.graphicsLayerIds, function(id) {
                console.log('app.MapController::addLayerAndMakeVisible||looping ids ', id);
                return id === props.id;
            }, this);

            console.log('app.MapController::addLayerAndMakeVisible||already added ', alreadyAdded);

            if (!alreadyAdded) {
                var LayerClass;

                switch (props.serviceType || 'dynamic') {
                    case 'feature':
                        {
                            LayerClass = FeatureLayer;

                            this.infoTemplate = new InfoTemplate();
                            this.infoTemplate.setTitle('<b>Utility Information</b>');

                            //props.infoTemplate = infoTemplate;
                            props.visible = false;
                            props.outFields = ['PROVIDER', 'WEBLINK', 'TELEPHONE'];
                            break;
                        }
                    case 'tiled':
                        {
                            LayerClass = ArcGISTiledMapServiceLayer;
                            break;
                        }
                    default:
                        {
                            LayerClass = ArcGISDynamicMapServiceLayer;
                            break;
                        }
                }

                lyr = new LayerClass(props.url, props);
                lyr.on('click', lang.hitch(this, 'highlight'));
                lyr.on('click', lang.hitch(this, 'showPopup'));

                // var self = this;
                // lyr.on('mouse-over', lang.hitch(this, 'showPopup'));
                // lyr.on('mouse-out', function() {
                //     self.map.infoWindow.hide();
                // });

                this.map.addLayer(lyr);
                this.map.addLoaderToLayer(lyr);

                this.map.infoWindow.resize(155, 155);

                this.layers.push({
                    id: props.id,
                    layer: lyr
                });
            }

            this.activeLayer = array.filter(this.layers, function(container) {
                console.log('app.MapController::addLayerAndMakeVisible||hiding layer ', container.id);
                container.layer.hide();
                return container.id === props.id;
            }, this)[0];

            if (this.activeLayer) {
                this.clearGraphic(this.graphic);
                this.updateOpacity();
                this.activeLayer.layer.show();
            }
        },
        updateOpacity: function(opacity) {
            // summary:
            //      changes a layers opacity
            // opacity
            console.log('app.MapController::updateOpacity', arguments);

            if (opacity !== undefined) {
                this.currentOpacity = opacity / 100;
            }

            if (!this.activeLayer) {
                //no layer selected yet return
                return;
            }

            this.activeLayer.layer.setOpacity(this.currentOpacity);
        },
        startup: function() {
            // summary:
            //      startup once app is attached to dom
            console.log('app.MapController::startup', arguments);

            array.forEach(this.childWidgets, function(widget) {
                widget.startup();
            }, this);
        },
        highlight: function(evt) {
            // summary:
            //      adds the clicked shape geometry to the graphics layer
            //      highlighting it
            // evt - mouse click event
            console.log('app.MapController::highlight', arguments);

            this.clearGraphic(this.graphic);

            this.graphic = new Graphic(evt.graphic.geometry, this.symbol);
            this.map.graphics.add(this.graphic);
        },
        clearGraphic: function(graphic) {
            // summary:
            //      removes the graphic from the map
            // graphic
            console.log('app.MapController::clearGraphic', arguments);

            if (graphic) {
                this.map.graphics.remove(graphic);
                this.graphic = null;
            }
        },
        showPopup: function(mouseEvent) {
            // summary:
            //      shows the popup content for the graphic on the mouse over event
            // mouseEvent - mouse over event
            console.log('app.MapController::showPopup', arguments);

            var graphic = mouseEvent.graphic;

            if (graphic === undefined) {
                return;
            }

            var content = this.buildContent(graphic.attributes);
            this.map.infoWindow.setContent(content);

            //var highlightgraphic = new graphic(evt.graphic.geometry, highlightSymbol);
            //map.graphics.add(highlightgraphic);

            this.map.infoWindow.show(mouseEvent.screenPoint,
                this.map.getInfoWindowAnchor(mouseEvent.screenPoint));
        },
        buildContent: function(attributes) {
            // summary:
            //      build the popup content text based on the attribute values
            // attributes
            console.log('app.MapController::buildContent', arguments);

            var hasUrl = '<dl><dt>Provider</dt>' +
                '<dd><a href="${WEBLINK}" target="_blank">${PROVIDER}</a>' +
                '</dd><dt>Telephone</dt><dd>${TELEPHONE}</dd></dl>',
                urlIsNa = '<dl><dt>Provider</dt><dd>${PROVIDER}<dt>Telephone</dt>' +
                '<dd>${TELEPHONE}</dd></dl>',
                template = '';

            template = urlIsNa;

            if (attributes && attributes.WEBLINK && attributes.WEBLINK !== 'N/A') {
                template = hasUrl;
            }

            return esriLang.substitute(attributes, template);
        },
        destroy: function() {
            // summary:
            //      destroys all handles
            console.log('app.MapControl::destroy', arguments);

            array.forEach(this.handles, function(hand) {
                hand.remove();
            });

            array.forEach(this.childWidgets, function(widget) {
                widget.destroy();
            }, this);
        }
    };
});