/**
 * Data
 * @module
 * @type geojson
 */


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var $countries = data.register('countries');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------

    // Country shapes
    var $country_query = helpers.load_csv("data/country/countries.geojson", 'json');

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

        data.resolve('countries', countries);

    });

    return $countries;

});

// -------------------------------------------------------------

