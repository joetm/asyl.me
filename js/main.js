/**
 * Main Application
 * @module
 */

/* global $, L, Papa */

define([
    'config',
    'data',
    'map',
    'domReady',
    'tpl',
    'helpers'
], function (config, data, map, domReady, tpl, helpers) {
    'use strict';

    domReady(function (doc) {

        // remove the loader
        $('#loader').addClass('done');

        // -------------------------------------------------------------


        // create an array of color shadings
        $.when($countries, $happiness, $max).done(function (countries, happiness, max) {
            // console.log('building shading');
            // console.log(countries);
            // console.log(happiness);
            // create a shading range
            var shades = {};
            for (var i = 0, s = happiness.length; i < s; i++) {
                // does the country name need to be remapped?
                // console.log(remapping[happiness[i]['Country']]);
                //if (remapping[happiness[i].Country] !== undefined) {
                //    happiness[i].Country = remapping[happiness[i].Country];
                //    // console.log('remapped', happiness[i]);
                //}
                shades[happiness[i].Country] = 100 - happiness[i].Score / max * 100;
            }
            // console.log('shades', shades);
            $shades.resolve(shades);
        });

        // ---------------------
        // panels
        // ---------------------

        // options in bottom left
        /*
        $.when(templates).done(function (templates) {
            var info_options = L.control({position: 'bottomleft'});
            info_options.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info selector');
                div.innerHTML = templates.info_options;
                return div;
            };
            info_options.addTo(map);
        });
        */

        // info panel in top right
        tpl.info_panel.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info panel');
            div.innerHTML = 'Choose your origin'; // tpl.info_panelTpl({name: 'Country'});
            // initially hidden
            // L.DomUtil.addClass(div, 'hidden');
            return div;
        };
        console.log('tpl.info_panel', tpl.info_panel);
        console.log('map', map);
        tpl.info_panel.addTo(map);

        // (debug) info panel at bottom right
        tpl.info_detail.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info detail');
            // initially hidden
            L.DomUtil.addClass(div, 'hidden');
            L.DomUtil.addClass(div, 'pull-right');
            L.DomUtil.addClass(div, 'bottomright');
            div.innerHTML = tpl.info_detailTpl({name: 'Country'});
            return div;
        };
        tpl.info_detail.addTo(map);
        $('.info.debug').parent('div').addClass('debug');
        $info_detail.resolve(tpl.info_detail);

        // legend (bottom right)
        $.when($min, $max).done(function (min, max) {
            var legend = L.control({position: 'bottomright'});
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    // generate integer range
                    // see http://stackoverflow.com/a/10050831/426266
                    grades = Array.apply(null, Array(parseInt(max + 1, 10))).map(function (_, i) {return i;}),
                    labels = [];
                // console.log(grades);
                // header?
                // div.innerHTML += '<div>Happiness<br />Index</div>';
                // color for countries with no data:
                div.innerHTML +=
                    '<div><i style="background:'+config.defaultStyle.fillColor+'"></i> ?' + '</div>';
                // loop through shades intervals and generate a label with a colored square for each interval
                var diff = parseInt(min, 10) + 1;
                for (var i = diff; i < grades.length; i++) {
                    div.innerHTML +=
                        '<div><i style="background:' + helpers.getLegendColor(grades[i - diff] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')+'</div>';
                }
                L.DomUtil.addClass(div, 'pull-right');
                L.DomUtil.addClass(div, 'bottomright');
                return div;
            };
            legend.addTo(map);
        });


        // ---------------------

        // process the shapes and shades data
        $.when($countries, $happiness, $population, $areas, $gdp, $centroids, $shades, $max, $info_detail).done(function (countries, happiness, population, areas, gdp, centroids, shades, max, info_detail) {

            // console.log('countries', countries);
            var happiness_layer = L.geoJson(countries, {
                // style: config.defaultStyle,
                onEachFeature: function(feature, layer) {

                    // happiness
                    feature.properties.happiness = helpers.get_happiness(feature.properties.name, happiness);

                    // gdp
                    feature.properties.gdp = helpers.get_property(feature.properties.name, gdp, 'IntDollar');
                    // TODO: fix GDP for Syria

                    // population
                    feature.properties.population = helpers.get_property(feature.properties.name, population, 'Population');

                    // area
                    feature.properties.area = helpers.get_property(feature.properties.name, areas, 'Land');

                    // centroid
                    feature.properties.center = helpers.get_properties(feature.properties.name, centroids, ['LAT', 'LONG']);

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
                            fillColor: 'hsl(66, 22%, ' + (max*10 - shades[feature.properties.name]) + '%)'
                        });
                    }




                    // console.log('feature', feature);
                    // console.log('layer', layer);

                    layer.on("click", function (e) {
                        // console.log(this.feature.properties.name, this.options.fillColor);
                        // panel with debug info
                        info_detail._container.innerHTML = info_detailTpl({
                            name: this.feature.properties.name,
                            happiness: feature.properties.happiness,
                            population: feature.properties.population.formatNumber(),
                            area: feature.properties.area.formatNumber(),
                            ppa: feature.properties.ppa.toFixed(2), // round to two decimals
                            gdp: feature.properties.gdp.formatNumber()
                        });
                        // content for top right panel
                        info_panel._container.innerHTML = info_panelTpl({
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
                        L.DomUtil.removeClass(info_detail._container, 'hidden');
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
            }).addTo(map);
            $happiness_layer.resolve(happiness_layer);
            // happiness_layer.bringToBack();
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

        // selector change
        $('.map .info.selector select').on('change', function () {
            alert('reloading');
            console.log('reloading');
        });


        // let's check the border crossings
        $.when($bordercrossings_query).done(function (bordercrossing_data) {
            var bordercrossing_layer = L.geoJson(bordercrossing_data, {
                pointToLayer: function (feature, latlng) {
                    // circles instead of markers
                    feature.properties.radius = 50;
                    return circle = L.circle(latlng, feature.properties.radius, {
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
            $bordercrossing_layer.resolve(bordercrossing_layer);
        });

        // overlays
        $.when($bordercrossing_layer, $happiness_layer).done(function (bordercrossing_layer, happiness_layer) {

            config.overlayMaps['Happiness Score'] = happiness_layer;
            config.overlayMaps['Border Crossings'] = bordercrossing_layer;

            var control = L.control.layers(config.overlayMaps).addTo(map);
            control.setPosition('bottomleft');

        });

    });// domReady

});
