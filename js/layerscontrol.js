/**
 * Layers
 * @module
 */

/*global define*/

define([
    'leaflet',
    'map',
    'config',
    'happiness_layer',
    'bordercrossings_layer',
    'app'
], function (L, map, config, happiness, bordercrossings, app) {
    'use strict';

    console.log('config.overlayMaps', config.overlayMaps);

    var control = L.control.layers(config.overlayMaps).addTo(map);

    // add the initial overlay of happiness
    config.overlayMaps['Happiness Score'].addTo(map);

    control.setPosition('bottomleft');

    return control;

});