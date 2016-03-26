/** Configuration of Require.js */
requirejs.config({
    baseUrl: './',
    waitSeconds: 0,
    // cache buster for development
    // see: http://requirejs.org/docs/api.html#config-urlArgs
    urlArgs: "bust=" + (new Date()).getTime(),
    // paths for libraries
    paths: {
        // -vendor libraries-------------------
        'jquery': './vendor/jquery/jquery.min',
        'domReady': './vendor/requirejs/domReady',
        'text': './vendor/requirejs/text',
        'leaflet': './vendor/leaflet/leaflet',
        'mapbox-arc': './vendor/mapbox/arc',
        'papaparse': 'vendor/papaparse/papaparse.min',
        'bootstrap': 'vendor/bootstrap/js/bootstrap.min',
        'doT': 'vendor/doT/doT.min',
        // ------------------------------------
        // application modules
        'config': './js/config',
        'tpl': './js/tpl',
        'helpers': './js/helpers',
        'data': './js/data',
        'map': './js/map',
        'panels': './js/panels',
        'main': './js/main',
        'happiness': './js/happiness',
        'arcs': './js/arcs'
        // ------------------------------------
    },
    // shim config to load modules in the right order
    // Note: keep implicit requisites to minimum
    shim: {
        'main': ['jquery', 'leaflet', 'papaparse'],
        'arcs': ['leaflet', 'mapbox-arc'],
        'helpers': ['jquery']
    }
});

// start the main app
requirejs(["main"]);