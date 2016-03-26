/**
 * Data
 * @module
 */


define(['jquery', 'domReady', 'helpers', 'papaparse'], function ($, domReady, helpers, Papa) {
    'use strict';

    return domReady(function (doc) {

        var data = {};

        data.$countries = $.Deferred();
        data.$population = $.Deferred();
        data.$areas = $.Deferred();
        data.$gdp = $.Deferred();
        data.$conflicts = $.Deferred();
        data.$centroids = $.Deferred();

        // -------------------------------------------------------------
        // AJAX queries
        // -------------------------------------------------------------
        // Country shapes
        var $country_query = helpers.load_csv("data/country/countries.geojson", 'json');
        // World population
        // https://docs.google.com/spreadsheets/d/1-lhti1yTM5CjlMTz3Hc_VqEnVTxbhoIS8WjUetmIWHs/pub?output=csv
        var $population_query = helpers.load_csv("data/population/population.csv");
        // Country areas
        // https://docs.google.com/spreadsheets/d/1KFjJ0AlYqeSOoUP5s8NGq4KUmZF65YeZc6m6WojwOHM/pub?output=csv
        var $area_query = helpers.load_csv("data/area/countries-area.csv");
        // GDP per capita (PPP) - IMF
        // https://docs.google.com/spreadsheets/d/1UIcp17LmWvzU1hZariKyvL6Gs81wWetMXCo99x49g1o/pub?output=csv
        var $gdp_query = helpers.load_csv("data/gdp/gdp.csv");
        // https://en.wikipedia.org/wiki/List_of_ongoing_armed_conflicts
        // https://docs.google.com/spreadsheets/d/1ZbOJhE7iBnUv1einXe6Ri5MqQKIfgwsrNoJLEMdZXMs/pub?output=csv
        var $conflicts_query = helpers.load_csv("data/war/war.csv");
        // http://gothos.info/resources/
        var $centroid_query = helpers.load_csv("data/country/country_centroids_all.csv");

// TODO: world's most liveable cities
// https://docs.google.com/spreadsheets/d/1B89nMJ1kgpQXh9tiyGh9GNNEUQyRlCx0DlzltfQbxVM/pub?output=csv


        // -------------------------------------------------------------
        // DATA processing
        // -------------------------------------------------------------

        $.when($country_query).done(function (country_data) {
            if (!country_data) {
                $country_query.reject('Could not load countries');
                return;
            }
            var countries = country_data.features;
            // console.log('countries', countries);
            data.$countries.resolve(countries);
        });

        $.when($centroid_query).done(function (centroid_data) {
            if (!centroid_data) {
                $centroid_query.reject('Could not load countries');
                return;
            }
            // parse the tsv data
            centroid_data = Papa.parse(centroid_data, {
                            delimiter: "\t",
                            newline: "",
                            header: true,
                            dynamicTyping: true
                });
            centroid_data = centroid_data.data;
            // build the keyed centroids object
            var centroids = {};
            $.each(centroid_data, function (index, item) {
                if (item.SHORT_NAME === undefined) {
                    return; // continue
                }
                centroids[item.SHORT_NAME] = item;
            });
            console.log('centroids', centroids);
            data.$centroids.resolve(centroids);
        });

        $.when($conflicts_query).done(function (conflicts_data) {
            if (!conflicts_data) {
                $conflicts_query.reject('Could not load war conflicts');
                return;
            }
            var conflicts = Papa.parse(conflicts_data, {
                            delimiter: ",",
                            newline: "",
                            header: true,
                            dynamicTyping: true
                });
            conflicts = conflicts.data;
            console.log('conflicts', conflicts);
            data.$conflicts.resolve(conflicts);
        });

        $.when($gdp_query).done(function (gdp_data) {
            if (!gdp_data) {
                $gdp_query.reject('Could not load gdp');
                return;
            }
            gdp_data = Papa.parse(gdp_data, {
                            delimiter: ",",
                            newline: "",
                            header: true,
                            dynamicTyping: true
                });
            gdp_data = gdp_data.data;
            var gdp = {};
            $.each(gdp_data, function (index, item) {
                // fix the number
                if (typeof item.IntDollar === 'string') {
                    item.IntDollar = parseInt(item.IntDollar.replace(/,/g, ''), 10);
                }
                // build the keyed gdp object
                gdp[item.Country] = item;
            });
            console.log('gdp', gdp);
            data.$gdp.resolve(gdp);
        });

        $.when($area_query).done(function (area_data) {
            // process, format and convert the area data into a keyed object
            if (!area_data) {
                $population.reject('Could not load area data');
                return;
            }
            area_data = Papa.parse(area_data, {
                            delimiter: ",",
                            newline: "",
                            header: true,
                            dynamicTyping: true
                });
            area_data = area_data.data;
            // console.log('area_data', area_data);
            var areas = {};
            var keys = ['Land in km2 (mi2)', 'Total in km2 (mi2)', 'Water in km2 (mi2)'];
            var newkeys = {
                'Land in km2 (mi2)': 'Land',
                'Total in km2 (mi2)': 'Total',
                'Water in km2 (mi2)': 'Water'
            };
            var newkey = '';
            for (var i = 0, s = area_data.length; i < s; i++) {
                // split the miles
                // or remove the miles
                $.each(keys, function (index, key) {
                    if(
                        area_data[i].hasOwnProperty(key) &&
                        typeof area_data[i][key] === 'string'
                    ) {
                        area_data[i][key] = area_data[i][key]
                                                    .replace(/\s*\([\d\.\,]+\)/g, '');
                        // convert what's left into a usable number
                        area_data[i][key] = parseInt(area_data[i][key].replace(/,/g, ''), 10);
                        // rename the key
                        newkey = newkeys[key]; // key.replace(/\s*in\skm2\s*\(mi2\)/g, '');
                        // rename the keys
                        area_data[i][newkey] = area_data[i][key];
                        delete area_data[i][key];
                    }
                });
                areas[area_data[i].Country] = area_data[i];
            }
            console.log('areas', areas);
            data.$areas.resolve(areas);
        });

        $.when($population_query).done(function (population_data) {
            if (!population_data) {
                $population.reject('Could not load population data');
                return;
            }
            //population_data = population_data.split("\n");
            //population_data = population_data.map(function (p) {
                // split the rows by ',' and remove '"' from each value in the array
                // return p.split(',');
                //.map(function (t) {
                //    return t.replace(/"/g, '');
                //});
            //    return p;
            //});

            population_data = Papa.parse(population_data, {
                            delimiter: ",",
                            newline: "",
                            header: true,
                            dynamicTyping: true
                });

            population_data = population_data.data;

            var population = {};

            for (var i = 0, s = population_data.length; i < s; i++) {
                // fix the nasty country key
                for(var key in population_data[i]) {
                    if(
                        population_data[i].hasOwnProperty(key) &&
                        typeof population_data[i][key] === 'string'
                    ) {
                        population_data[i][key] = population_data[i][key]
                                                    .replace(/\s*\[Note\s\d+\]/g, '')
                                                    .replace(/\s*\*\([a-z,\.\-\s]+\)\*/gi, '')
                                                    .replace(/[\*\"]/g, '');
                        // fix population figure
                        if (key === 'Population') {
                            population_data[i][key] = parseInt(population_data[i][key].replace(/,/g, ''), 10);
                        }
                    }
                }
                population[population_data[i]['Country (or dependent territory)']] = population_data[i];
            }

            // console.log('population_data', population_data);
            console.log('population', population);
            data.$population.resolve(population);
        });

        return data;

    }); // domReady

});

// -------------------------------------------------------------

