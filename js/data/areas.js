/**
 * Data
 * @module
 */


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var $areas = data.register('areas');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------

    // Country areas
    // https://docs.google.com/spreadsheets/d/1KFjJ0AlYqeSOoUP5s8NGq4KUmZF65YeZc6m6WojwOHM/pub?output=csv
    var $area_query = helpers.load_csv("data/area/countries-area.csv");

    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

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

        data.resolve('areas', areas);

    });

    return $areas;

});

// -------------------------------------------------------------

