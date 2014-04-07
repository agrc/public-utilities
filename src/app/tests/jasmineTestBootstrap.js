/*jshint unused:false*/
var dojoConfig = {
    has: {
        'dojo-undef-api': true
    },
    isJasmineTestRunner: true,
    packages: ['matchers', {
        name: 'stubmodule',
        location: 'stubmodule/src',
        main: 'StubModule'
    }]
};