/**
 * Bordercrossings layer
 * @module
 */

define(['config', 'leaflet', 'helpers'], function (config, L, helpers) {
    'use strict';

    // Border crossings
    var $bordercrossings_query = helpers.load_csv("data/bordercrossings/bordercrossings.geojson", 'json');

    $bordercrossings_query.done(function (bordercrossing_data) {
        var bordercrossing_layer = L.geoJson(bordercrossing_data, {
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
        // bordercrossing_layer.bringToFront();

        // add overlay layer to config
        config.overlayMaps['Border Crossings'] = bordercrossing_layer;

    });


});
