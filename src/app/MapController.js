define([
    'dojo/_base/lang',
    'dojo/_base/array',

    'dojo/topic',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    './config'
], function(
    lang,
    array,

    topic,

    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    FeatureLayer,

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


        // Properties to be sent into constructor
        // map: agrc/widgets/map/BaseMap
        map: null,

        init: function(params) {
            // summary:
            //      description
            console.log('app.MapController::init', arguments);

            lang.mixin(this, params);

            this.map = new BaseMap(this.mapDiv, {
                defaultBaseMap: 'Lite'
            });

            this.selector = new BaseMapSelector({
                map: this.map,
                id: 'claro',
                position: 'TR'
            });

            this.layers = [];

            this.setUpSubscribes();
        },
        setUpSubscribes: function() {
            // summary:
            //      subscribes to topics
            console.log('app.MapController::setUpSubscribes', arguments);

            this.handles.push(
                topic.subscribe(config.topics.map.enableLayer,
                    lang.hitch(this, 'addLayer'))
            );
        },
        addLayer: function(props) {
            // summary:
            //      description
            // props: object
            //  { url, serviceType, layerIndex, layerProps }
            console.log('app.MapController::addLayer', arguments);

            // check to see if layer has already been added to the map
            var lyr;
            var alreadyAdded = array.some(this.map.graphicsLayerIds, function(id) {
                console.log('app.MapController::addLayer||looping ids ', id);
                return id === props.id;
            }, this);

            console.log('app.MapController::addLayer||already added ', alreadyAdded);

            if (!alreadyAdded) {
                var LayerClass;
                switch (props.serviceType || 'dynamic') {
                    case 'feature':
                        {
                            LayerClass = FeatureLayer;
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

                lyr = new LayerClass(props.url, {
                    id: props.id,
                    visible: false
                });

                this.map.addLayer(lyr);
                this.map.addLoaderToLayer(lyr);

                this.layers.push(lyr);
            }

            var visibleLayer = array.filter(this.layers, function(layer) {
                console.log('app.MapController::addLayer||hiding layer ', layer.id);
                layer.hide();
                return layer.id === props.id;
            }, this)[0];

            if(visibleLayer)
            {
                visibleLayer.show();
            }
        },
        destroy: function() {
            // summary:
            //      destroys all handles
            console.log('app.MapControl::destroy', arguments);

            array.forEach(this.handles, function(hand) {
                hand.remove();
            });

            this.selector.destroy();
        }
    };
});