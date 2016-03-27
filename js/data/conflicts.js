/**
 * Data
 * @module
 */

/*global define*/


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var $conflicts = data.register('conflicts');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------

    // https://en.wikipedia.org/wiki/List_of_ongoing_armed_conflicts
    // https://docs.google.com/spreadsheets/d/1ZbOJhE7iBnUv1einXe6Ri5MqQKIfgwsrNoJLEMdZXMs/pub?output=csv
    var $conflicts_query = helpers.load_csv("data/war/war.csv");

    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

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

        data.resolve('conflicts', conflicts);

    });

    return $conflicts;

});

// -------------------------------------------------------------

