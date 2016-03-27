/**
 * Bordercrossings layer
 * @module
 */

/*global define*/


define(['config', 'bordercrossings', 'leaflet', 'helpers'], function (config, $bordercrossings, L, helpers) {
    'use strict';

    var LOGPREFIX = 'bordercrossings_layer:';

    $.when($bordercrossings).done(function (bordercrossings) {

        var bordercrossing_layer = L.geoJson(bordercrossings, {
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

        // add overlay layer to config
        config.overlayMaps['Border Crossings'] = bordercrossing_layer;

    });

});
