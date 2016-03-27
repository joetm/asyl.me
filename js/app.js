/**
 * Main Application
 * @module
 */

/*global define, $, L, Papa*/

define([
    'config',
    'data',
    'map',
    'domReady',
    'tpl',
    'helpers',
    'panels',
    'happiness',
    'minmax'
], function (config, data, map, domReady, tpl, helpers, panels, $happiness, $minmax) {
    'use strict';

    var LOGPREFIX = 'app:';

    domReady(function (doc) {

        // remove the loader
        $('#loader').addClass('done');

        // -------------------------------------------------------------

        // process the shapes and shades data
        $.when(
            $happiness,
            $minmax,
            data.allresolved
        ).done(function (happiness, minmax, data) {

            // console.log(LOGPREFIX+'happiness', happiness);
            // console.log(LOGPREFIX+'minmax', minmax);

            // create a shading range
            var shades = {};
            var keys = Object.keys(happiness);
            for (var i = 0, s = keys.length; i < s; i++) {
                // does the country name need to be remapped?
                // console.log(remapping[happiness[i]['Country']]);
                //if (remapping[happiness[i].Country] !== undefined) {
                //    happiness[i].Country = remapping[happiness[i].Country];
                //    // console.log('remapped', happiness[i]);
                //}
                // console.log(LOGPREFIX+'hscore', happiness[keys[i]].Score);
                shades[keys[i]] = 100 - happiness[keys[i]].Score / minmax.max * 100;
            }
            console.log(LOGPREFIX+'shades', shades);

            // console.log(LOGPREFIX+'countries', countries);
            var happiness_layer = L.geoJson(data.countries, {
                // style: config.defaultStyle,
                onEachFeature: function(feature, layer) {

                    // TODO:
                    // each plugin must do this itself











                    // happiness
                    feature.properties.happiness = helpers.get_happiness(feature.properties.name, data.happiness);

                    // gdp
                    feature.properties.gdp = helpers.get_property(feature.properties.name, data.gdp, 'IntDollar');
                    // TODO: fix GDP for Syria

                    // population
                    feature.properties.population = helpers.get_property(feature.properties.name, data.population, 'Population');

                    // area
                    feature.properties.area = helpers.get_property(feature.properties.name, data.areas, 'Land');

                    // centroid
                    feature.properties.center = helpers.get_properties(feature.properties.name, data.centroids, ['LAT', 'LONG']);

                    // population per area
                    feature.properties.ppa = 0;
                    if (
                        feature.properties.area > 0
                    ) {
                        if (!feature.properties.population) {
                            feature.properties.population = 0;
                        }
                        feature.properties.ppa = feature.properties.population / feature.properties.area;
                    }




                    // set coloring / shading
                    layer.setStyle(config.defaultStyle);
                    if (shades[feature.properties.name] !== undefined) {
                        layer.setStyle({
                            fillColor: 'hsl(66, 22%, ' + (minmax.max * 10 - shades[feature.properties.name]) + '%)'
                        });
                    }



                    // console.log(LOGPREFIX+'feature', feature);
                    // console.log(LOGPREFIX+'layer', layer);

                    layer.on("click", function (e) {
                        // console.log(LOGPREFIX+this.feature.properties.name, this.options.fillColor);
                        // panel with debug info
                        tpl.info_detail._container.innerHTML = tpl.info_detailTpl({
                            name: this.feature.properties.name,
                            happiness: feature.properties.happiness,
                            population: feature.properties.population.formatNumber(),
                            area: feature.properties.area.formatNumber(),
                            ppa: feature.properties.ppa.toFixed(2), // round to two decimals
                            gdp: feature.properties.gdp.formatNumber()
                        });
                        // content for top right panel
                        tpl.info_panel._container.innerHTML = tpl.info_panelTpl({
                            name: this.feature.properties.name
                        });
                        // TODO:
                        // reset style of all layers to the happiness styling







                        // function to reset layers
                        happiness_layer.eachLayer(function(l){happiness_layer.resetStyle(l);});









                        //TODO:
                        //fix click on Greece and Greece data












                        // highlight the selected country
                        var l = e.target;
                        l.setStyle({
                            fillOpacity: 0.2
                        });

                        /*
                        // console.log(ppa);
                        if (ppa >= config.gdp.green) {
                            // console.log('gdp green');
                            $('.info.detail .gdp').css('color', 'green');
                        } else {
                            // console.log('gdp normal');
                            $('.info.detail .gdp').css('color', 'inherit');
                        }
                        */
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
            }); //.addTo(map);

            // add overlay layer to config
            config.overlayMaps['Happiness Score'] = happiness_layer;

        });

        /*
        // taking data from Google Sheet with parsed Wikipedia data
        // this works, but is too likely to break the site when changes are made
        try {
            // Happiness
            Tabletop.init({
                key: "1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04",
                callback: initApp,
                simpleSheet: true
            });
            // GDP
            //Tabletop.init({
            //    key: "1UIcp17LmWvzU1hZariKyvL6Gs81wWetMXCo99x49g1o",
            //    callback: initApp,
            //    simpleSheet: true
            //});
        } catch (err) {
            console.error(err);
            document.getElementById('map').innerHTML = 'Error: '+err;
            return;
        }
        */


        // ---------------------

    });// domReady

});
