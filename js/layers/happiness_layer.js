/**
 * Happiness
 * @module
 * @return Promise $happiness
 */


define(['config', 'happiness', 'leaflet', 'helpers', 'papaparse'], function (config, happiness, L, helpers, Papa) {
    'use strict';

    var LOGPREFIX = 'happiness_layer:';

    var happiness_layer = L.geoJson(happiness, {
        pointToLayer: function (feature, latlng) {
            // circles instead of markers
            feature.properties.radius = 50;
            return L.circle(latlng, feature.properties.radius, {
                radius: 10,
                //stroke: true,
                //weight: 2,
                color:'#ff0000',
                fillColor:'#ef8080'
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    }); //.addTo(map)
    // happiness_layer.bringToFront();

    // add overlay layer to config
    config.overlayMaps['Happiness Score'] = happiness_layer;

});
