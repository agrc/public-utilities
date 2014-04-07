require([
    'app/LayerPicker',
    'app/config',

    'dojo/_base/window',

    'dojo/dom-construct',

    'dojo/query',

    // 'stubmodule',

    'matchers/Topics'
], function(
    WidgetUnderTest,
    config,

    win,

    domConstruct,

    query,

    //stubmodule,

    Topics
) {
    describe('app/LayerPicker', function() {
        var widget;
        var destroy = function(widget) {
            widget.destroyRecursive();
            widget = null;
        };
        var layerData = [{
                group: 'group',
                value: 'value',
                url: '//url',
                labelText: 'labelText'
            }, {
                group: 'group',
                value: 'value2',
                url: '//url2',
                labelText: 'labelText2'
            }];
        var topics = config.topics.map;

        beforeEach(function() {
            widget = new WidgetUnderTest(null, domConstruct.create('div', null, win.body()));
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a LayerPicker', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });

        describe('Map Layers', function() {
            beforeEach(function () {
                destroy(widget);

                Topics.listen(topics.enableLayer);

                // stubmodule('app/LayerPicker', {
                //     'app/data/mapLayers': layerData
                // }).then(function(StubbedModule) {
                //     widget = new StubbedModule(null, domConstruct.create('div', null, win.body()));
                //     widget.startup();
                //     done();
                // });
            });

            it('creates a radio button for each map layer item', function() {
                expect(query('input[type="radio"]', widget.domNode).length).toEqual(layerData.length);
            });

            it('publishes a topic when a layerItem is checked', function(){
                widget.childWidgets[0].activated();
                expect(topics.enableLayer).toHaveBeenPublished();
            });
        });
    });
});