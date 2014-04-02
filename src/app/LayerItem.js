define([
    'dojo/text!./templates/LayerItem.html',

    'dojo/_base/declare',

    'dojo/on',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin'
], function(
    template,

    declare,

    on,

    _WidgetBase,
    _TemplatedMixin
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:
        //      A widget that knows about it's layer

        templateString: template,
        baseClass: 'layer-item',

        // Properties to be sent into constructor

        // group: string
        // summary:
        //      the radio button group name 
        group: null,

        // value: string
        // summary:
        //      the value when the radio button is checked 
        value: null,

        // labelText: string
        // summary:
        //      the text to show for the radio buton 
        labelText: null,

        // url: esri/FeatureLayer
        // summary:
        //      the url of the layer to be visible in the map 
        url: null,

        postCreate: function() {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('app.LayerItem::postCreate', arguments);

            this.setupConnections();

            this.inherited(arguments);
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('app.LayerItem::setupConnections', arguments);

        },
        activated: function() {
            // summary:
            //      called on click and emit's it's data
            // 
            console.log('app.LayerItem::activated', arguments);

            on.emit(this.domNode, 'map-layer-activated', {
                layerInfo: {
                    url: this.url,
                    id: this.value,
                    serviceType: this.serviceType
                },
                bubbles: true,
                cancelable: false
            });
        }
    });
});