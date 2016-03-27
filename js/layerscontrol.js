/**
 * Layers
 * @module
 */

define([
    'leaflet',
    'map',
    'config',
    'happiness_layer',
    'bordercrossings_layer',
    'app'
], function (L, map, config, happiness, bordercrossings, app) {
    'use strict';

    // TODO
    // fix overlays









    console.log('config.overlayMaps', config.overlayMaps);

    var control = L.control.layers(config.overlayMaps).addTo(map);
    control.setPosition('bottomleft');

    return control;

});