define([
    'dojo/text!./templates/LayerPicker.html',

    'dojo/_base/declare',
    'dojo/_base/array',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    './LayerItem',

    './data/mapLayers'
], function(
    template,

    declare,
    array,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    LayerItem,

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

            array.forEach(mapLayers, function(layerInfo){
                this.childWidgets.push(new LayerItem(layerInfo).placeAt(this.listItems, 'last'));
            }, this);

            this.inherited(arguments);
        },
        startup: function() {
            // summary:
            //      startup
            console.log('app.LayerPicker::startup', arguments);

            array.forEach(this.childWidgets, function (widget) {
                this.own(widget);
                widget.startup();
            }, this);

            this.inherited(arguments);
        }
    });
});