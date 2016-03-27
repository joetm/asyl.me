/** Configuration of Require.js */

// -data plugins ----------------------
var data_plugins = ['areas', 'centroids', 'conflicts', 'countries', 'gdp', 'population', 'happiness', 'bordercrossings'];
var data_layers  = ['happiness_layer', 'bordercrossings_layer'];

var config = {
    baseUrl: './',
    waitSeconds: 0,
    // cache buster for development
    // see: http://requirejs.org/docs/api.html#config-urlArgs
    urlArgs: "bust=" + (new Date()).getTime(),
    // paths for libraries
    paths: {
        // -vendor libraries-------------------
        'jquery': './vendor/jquery/dist/jquery.min',
        'domReady': './vendor/domReady/domReady',
        'text': './vendor/text/text',
        'leaflet': './vendor/leaflet/dist/leaflet',
        'mapbox-arc': './vendor/mapbox/arc',
        'papaparse': 'vendor/papaparse/papaparse.min',
        'bootstrap': 'vendor/bootstrap/dist/js/bootstrap.min',
        'doT': 'vendor/doT/doT.min',
        // -application modules----------------
        'config': './js/config',
        'tpl': './js/tpl',
        'helpers': './js/helpers',
        'data': './js/data',
        'map': './js/map',
        'panels': './js/panels',
        'minmax': './js/minmax',
        'mapbox-arc': './js/mapbox-arc',
        'app': './js/app',
        // -layers ----------------------------
        'happiness_layer': './js/layers/happiness_layer',
        'bordercrossings_layer': './js/layers/bordercrossings_layer',
        'migration': './js/layers/migration',
        'layerscontrol': './js/layerscontrol'
        // ------------------------------------
    },
    // shim config to load modules in the right order
    // Note: keep implicit requisites to minimum
    shim: {
        'app': ['jquery', 'leaflet', 'papaparse'],
        'arcs': ['leaflet', 'mapbox-arc'],
        'helpers': ['jquery'],
        'layerscontrol': data_layers
    }
};


// ---------------------------------------------------
// END CONFIG ----------------------------------------
// ---------------------------------------------------


// load the data plugins
var keys = Object.keys(data_plugins);
for (var i = 0, s = keys.length; i < s; i++){
    config.paths[data_plugins[keys[i]]] = './js/data/' + data_plugins[keys[i]];
}

// set the config
requirejs.config(config);

// start the main app
requirejs(["app"]);

// start the data plugins
requirejs(data_plugins);

// start the data plugins
// requirejs(data_layers);

//console.log('datalayer prereqs:', data_layers);

// start the layers
requirejs(["layerscontrol"]);