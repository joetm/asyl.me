/**
 * Map
 * @module
 */

define(['config', 'leaflet'], function (config, L) {
    'use strict';

    // leaflet map
    var map = L.map('map', {
        center: L.latLng(47.5133586, 10.1074008),
        zoom: config.zoom_level,
        animate: config.animate,
        layers: [ config.baseMaps.tiles ]
    });

    return map;

});
