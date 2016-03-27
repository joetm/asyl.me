/**
 * Data
 * @module
 */

/*global define*/


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var $gdp = data.register('gdp');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------

    // GDP per capita (PPP) - IMF
    // https://docs.google.com/spreadsheets/d/1UIcp17LmWvzU1hZariKyvL6Gs81wWetMXCo99x49g1o/pub?output=csv
    var $gdp_query = helpers.load_csv("data/gdp/gdp.csv");

    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

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

        data.resolve('gdp', gdp);


//TODO
            // gdp
            // feature.properties.gdp = get_property(feature.properties.name, gdp, 'IntDollar');
            // TODO: fix GDP for Syria



    });

    return $gdp;

});

// -------------------------------------------------------------

