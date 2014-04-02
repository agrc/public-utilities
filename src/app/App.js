define([
    'dojo/text!./templates/App.html',

    'dojo/_base/declare',
    'dojo/_base/array',

    'dojo/dom',
    'dojo/dom-style',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/registry',

    'dijit/form/HorizontalSlider',

    'agrc/widgets/locate/FindAddress',

    './MapController',
    './LayerPicker',

    './config',


    'dojo/domReady!'
], function(
    template,

    declare,
    array,

    dom,
    domStyle,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    registry,

    HorizontalSlider,

    FindAddress,

    MapController,
    LayerPicker,

    config
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        // childWidgets: Object[]
        //      container for holding custom child widgets
        childWidgets: null,

        constructor: function() {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            config.app = this;
            this.childWidgets = [];

            this.inherited(arguments);
        },
        postCreate: function() {
            // summary:
            //      Fires when
            console.log('app.App::postCreate', arguments);

            MapController.init({
                mapDiv: this.mapDiv
            });

            this.childWidgets.push(
                new FindAddress({
                    map: MapController.map,
                    title: 'Find providers for my address',
                    apiKey: config.apiKey
                }, this.geocodeNode),
                new LayerPicker({

                }, this.layerPickerNode),
                new HorizontalSlider({}, this.sliderNode)
            );

            this.inherited(arguments);
        },
        startup: function() {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            array.forEach(this.childWidgets, function(widget) {
                this.own(widget);
                widget.startup();
            }, this);

            this.inherited(arguments);
        }
    });
});