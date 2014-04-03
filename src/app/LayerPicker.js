define([
    'dojo/text!./templates/LayerPicker.html',

    'dojo/_base/declare',
    'dojo/_base/array',

    'dojo/on',
    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    './LayerItem',
    './config',

    './data/mapLayers'
], function(
    template,

    declare,
    array,

    on,
    topic,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    LayerItem,
    config,

    mapLayers
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Lets users choose what layer to show on the map

        templateString: template,
        baseClass: 'layer-picker',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('app.LayerPicker::postCreate', arguments);

            this.childWidgets = [];

            array.forEach(mapLayers, function(layerInfo) {
                var item = new LayerItem(layerInfo).placeAt(this.listItems, 'last');
                item.on('map-layer-activated', this.notifyMap);
                this.childWidgets.push(item);
            }, this);

            this.inherited(arguments);
        },
        notifyMap: function(e) {
            // summary:
            //      tell the map controller to do stuff
            console.log('app.LayerPicker::notifyMap', arguments);

            topic.publish(config.topics.map.enableLayer, e.layerInfo);
        },
        startup: function() {
            // summary:
            //      startup
            console.log('app.LayerPicker::startup', arguments);

            array.forEach(this.childWidgets, function(widget) {
                this.own(widget);
                widget.startup();
            }, this);

            this.inherited(arguments);
        }
    });
});