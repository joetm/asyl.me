/**
 * Happiness
 * @module
 * @return Promise $happiness
 */


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var LOGPREFIX = 'happiness:';

    var $happiness = data.register('happiness');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------
    // Happiness index
    // https://docs.google.com/spreadsheets/d/1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04/pub?output=csv
    var $happiness_query = helpers.load_csv("data/happiness/world-happiness-index.csv")

    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

    $happiness_query.done(function (happiness_data) {
        if (!happiness_data) {
            $happiness.reject('Could not load happiness data');
            return;
        }
        // parse the csv data
        happiness_data = Papa.parse(happiness_data, {
                        delimiter: ",",
                        newline: "",
                        header: true,
                        dynamicTyping: true
            });
        happiness_data = happiness_data.data;
        // console.log(LOGPREFIX+'happiness_data', happiness_data);

        // build the happiness object
        var happiness = {};
        $.each(happiness_data, function (index, item) {
            if (item.Country === undefined) {
                return; // skip this row
            }
            //convert some of the strings to numbers
            if (item.Rank !== undefined) {
                item.Rank = parseInt(item.Rank, 10);
            }
            if (item.Score !== undefined) {
                item.Score = parseFloat(item.Score);
            }
            // store in object
            happiness[item.Country] = item;
        });
        // console.log(LOGPREFIX+'happiness', happiness);

        data.resolve('happiness', happiness);

    });

    return $happiness;

});
