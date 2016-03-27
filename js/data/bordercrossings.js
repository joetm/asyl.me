/**
 * Data
 * @module
 * @type geojson
 */


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var $bordercrossings = data.register('bordercrossings');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------

    // Border crossings
    var $bordercrossings_query = helpers.load_csv("data/bordercrossings/bordercrossings.geojson", 'json');

    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

    $bordercrossings_query.done(function (bordercrossing_data) {

        data.resolve('bordercrossings', bordercrossing_data);

    });

    return $bordercrossings;

});

// -------------------------------------------------------------

