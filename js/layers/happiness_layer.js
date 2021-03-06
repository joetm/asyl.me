/**
 * Happiness
 * @module
 * @return Promise $happiness
 */

/*global define*/


define([
    'jquery',
    'config',
    'leaflet',
    'helpers',
    'papaparse',
    'tpl',
    'data',
    'countries',
    'happiness',
    'minmax'
], function (
    $,
    config,
    L,
    helpers,
    Papa,
    tpl,
    data,
    countries,
    happiness,
    minmax
) {
    'use strict';

    var LOGPREFIX = 'happiness_layer:';

    $.when(countries, happiness, minmax).done(function (countries, happiness, minmax) {

        // console.log(LOGPREFIX+'countries', countries);
        // console.log(LOGPREFIX+'happiness', happiness);
        // console.log(LOGPREFIX+'minmax', minmax);

        // create a shading range from the happiness scores
        var shades = {};
        var keys = Object.keys(happiness);
        for (var i = 0, s = keys.length; i < s; i++) {
            // does the country name need to be remapped?
            //if (remapping[happiness[i].Country] !== undefined) {
            //    happiness[i].Country = remapping[happiness[i].Country];
            //    // console.log(LOGPREFIX+'remapped', happiness[i]);
            //}
            // console.log(LOGPREFIX+'hscore', happiness[keys[i]].Score);
            shades[keys[i]] = 100 - happiness[keys[i]].Score / minmax.max * 100;
        }
        // console.log(LOGPREFIX+'shades', shades);

        // console.log(LOGPREFIX+'countries', countries);

        var happiness_layer = L.geoJson(countries, {
            style: config.defaultStyle,
            onEachFeature: function (feature, layer) {

                // happiness
                feature.properties.happiness = helpers.get_property(feature.properties.name, happiness, 'Score');
                // console.log(LOGPREFIX+'feature.properties.happiness', feature.properties.happiness);

                // set coloring / shading
                if (shades[feature.properties.name] !== undefined) {
                    // console.log(LOGPREFIX+'hsl', 'hsl(66, 22%, ' + (minmax.max * 10 - shades[feature.properties.name]) + '%)');
                    layer.setStyle({
                        fillColor: 'hsl(66, 22%, ' + (minmax.max * 10 - shades[feature.properties.name]) + '%)'
                    });
                }

                // console.log(LOGPREFIX+'feature', feature);
                // console.log(LOGPREFIX+'layer', layer);

                // -----------------------------

                layer.on("click", function (e) {
                    // console.log(LOGPREFIX+this.feature.properties.name, this.options.fillColor);
                    // panel with debug info
                    tpl.info_detail._container.innerHTML = tpl.info_detailTpl({
                        name: this.feature.properties.name,
                        happiness: feature.properties.happiness
                        //TODO
                        //population: feature.properties.population.formatNumber(),
                        //area: feature.properties.area.formatNumber(),
                        //ppa: feature.properties.ppa.toFixed(2), // round to two decimals
                        //gdp: feature.properties.gdp.formatNumber()









                    });
                    // content for top right panel
                    tpl.info_panel._container.innerHTML = tpl.info_panelTpl({
                        name: this.feature.properties.name
                    });
                    // TODO:
                    // reset style of all layers to the happiness styling





                    // function to reset layers
                    // geojson.eachLayer(function(l){geojson.resetStyle(l);});









                    //TODO:
                    //fix click on Greece and Greece data












                    // highlight the selected country
                    //var l = e.target;
                    //l.setStyle({
                    //    fillOpacity: 0.2
                    //});

                    // show the info container
                    L.DomUtil.removeClass(tpl.info_detail._container, 'hidden');
                });

                /*
                layer.on("mouseover", function (e) {
                    // console.log(layer.options.style);
                    layer.options.origstyle = layer.options.style;
                    layer.setStyle(config.highlightStyle);
                });
                layer.on("mouseout", function (e) {
                    // console.log('origstyle', layer.options.origstyle);
                    layer.setStyle(layer.options.origstyle);
                });
                */

            }
        }); //.addTo(map)
        // happiness_layer.bringToFront();

        // add overlay layer to config
        console.log(LOGPREFIX+'happiness_layer', happiness_layer);
        config.overlayMaps['Happiness Score'] = happiness_layer;

    });

});
