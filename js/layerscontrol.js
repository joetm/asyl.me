/**
 * Layers
 * @module
 */

define([
    'leaflet',
    'map',
    'config',
    'happiness',
    'bordercrossings',
    'main'
], function (L, map, config) {
    'use strict';

    // TODO
    // fix overlays









    console.log('config.overlayMaps', config.overlayMaps);

    var control = L.control.layers(config.overlayMaps).addTo(map);
    control.setPosition('bottomleft');

    return control;

});