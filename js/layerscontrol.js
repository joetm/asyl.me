/**
 * Layers
 * @module
 */

/*global define*/


define([
    'leaflet',
    'map',
    'config',
    'app'
], function (L, map, config, app) {
    'use strict';

    console.log('config.overlayMaps', config.overlayMaps);

    // add the control to the map
    var control = L.control.layers(config.overlayMaps).addTo(map);
    control.setPosition('bottomleft');

    // add the initial overlay of happiness
    config.overlayMaps['Happiness Score'].addTo(map);

    return control;

});