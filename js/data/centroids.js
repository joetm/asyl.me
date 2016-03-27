/**
 * Data
 * @module
 */

/*global define*/


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var $centroids = data.register('centroids');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------

    // http://gothos.info/resources/
    var $centroid_query = helpers.load_csv("data/country/country_centroids_all.csv");

    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

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

        data.resolve('centroids', centroids);

    });

    return $centroids;

});

// -------------------------------------------------------------

