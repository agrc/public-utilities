define(['dojo/has'], function(has) {
    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version: String
        //      The version number.
        version: '2.1.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: '',

        // exportWebMapUrl: String
        //      print task url
        exportWebMapUrl: 'http://mapserv.utah.gov/arcgis/rest/services/Utilities/' +
            'PrintingTools/GPServer/Export%20Web%20Map%20Task',

        urls: {
            vector: 'http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Vector/MapServer'
        }
    };

    if (has('agrc-api-key') === 'prod') {
        window.AGRC.apiKey = 'prod';
    } else if (has('agrc-api-key') === 'stage') {
        window.AGRC.apiKey = 'stage';
    } else {
        window.AGRC.apiKey = 'AGRC-B5D62BD2151902';
    }

    return window.AGRC;
});