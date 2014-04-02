define(['dojo/has'], function(has) {
    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: null,

        topics: {
            map: {
                addLayer: 'app.addLayer',
                toggleLayer: 'app.toggleLayer'
            }
        }
    };

    if (has('agrc-api-key') === 'prod') {
        window.AGRC.apiKey = 'prod';
    } else if (has('agrc-api-key') === 'stage') {
        window.AGRC.apiKey = 'AGRC-FFCDAD6B933051';
    } else {
        window.AGRC.apiKey = 'AGRC-B5D62BD2151902';
    }

    return window.AGRC;
});