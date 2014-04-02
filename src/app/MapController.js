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

            this.setUpSubscribes();
        },
        setUpSubscribes: function() {
            // summary:
            //      subscribes to topics
            console.log('app.MapController::setUpSubscribes', arguments);

            this.handles.push(
                topic.subscribe(config.topics.map.addLayer,
                    lang.hitch(this, 'addLayer')),
                topic.subscribe(config.topics.map.toggleLayer,
                    lang.hitch(this, 'toggleLayer'))
            );
        },
        addLayer: function(props) {
            // summary:
            //      description
            // props: object
            //  { url, serviceType, layerIndex, layerProps }
            console.log('app.MapController::addLayer', arguments);

            // check to see if layer has already been added to the map
            var that = this;
            var lyr;
            var alreadyAdded = array.some(this.map.layerIds, function(id) {
                return that.map.getLayer(id).url === props.url;
            });

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

                var config = lang.mixin({}, props.layerProps);

                lyr = new LayerClass(props.url, config);

                this.map.addLayer(lyr);
                this.map.addLoaderToLayer(lyr);

                if (props.layerIndex !== null) {
                    lyr.setVisibleLayers([-1]);
                    lyr.show();
                }
            }
        },
        toggleLayer: function(url, layerIndex, on) {
            // summary:
            //      toggles a reference layer on the map

            console.log('app.MapController::toggleLayer', arguments);

            var lyr;
            var that = this;
            array.some(this.map.layerIds, function(id) {
                var l = that.map.getLayer(id);
                if (l.url === url) {
                    lyr = l;
                    return true;
                }
            });

            if (layerIndex !== null) {
                var visLyrs = lyr.visibleLayers;
                if (on) {
                    visLyrs.push(layerIndex);
                } else {
                    visLyrs.splice(array.indexOf(visLyrs, layerIndex), 1);
                }
                lyr.setVisibleLayers(visLyrs);
            } else {
                var f = (on) ? lyr.show : lyr.hide;
                f.apply(lyr);
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