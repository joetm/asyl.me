/**
 * Happiness
 * @module
 */

var $min = $.Deferred();
var $max = $.Deferred();


define(['config', 'leaflet', 'helpers'], function (config, L, helpers) {
    'use strict';

    var $happiness = $.Deferred();

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------
    // Happiness index
    // https://docs.google.com/spreadsheets/d/1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04/pub?output=csv
    var $happiness_query = helpers.load_csv("data/happiness/world-happiness-index.csv")

    $.when($happiness_query).done(function (happiness_data) {

        if (!happiness_data) {
            $happiness.reject('Could not load happiness data');
            return;
        }

        var parsed_happiness = [],
            tmp;

        // split into rows
        happiness_data = happiness_data.split("\n");
        // console.log('happiness_data', happiness_data);

        // get the keys
        var keys = happiness_data[0].split(",").map(function (key) { return key.replace(/"/g, ''); });
        // remove the header row
        delete happiness_data[0];
        // console.log(keys);

        // loop through the rows
        for (var i = 0, s = happiness_data.length; i < s; i++) {
            if (happiness_data[i] === undefined) continue;
            happiness_data[i] = happiness_data[i].split(',');
            // console.log(happiness_data[i][2]);
            // loop through keys
            tmp = {};
            for (var j = 0, t = keys.length; j < t; j++) {
                if (happiness_data[i][j] === undefined) {
                    continue;
                }
                tmp[keys[j]] = happiness_data[i][j];
            }
            parsed_happiness.push(tmp);
        }

        //convert some of the strings to numbers
        var happiness = parsed_happiness.map(function (obj) {
            obj.Rank  = parseInt(obj.Rank, 10);
            obj.Score = parseFloat(obj.Score);
            return obj;
        });

        // console.log('happiness', happiness);
        $happiness.resolve(happiness);


        // TODO: fix this
        // calculate min/max happiness
        var tmax = 0,
            tmin;
        for (var i = 0, s = happiness.length; i < s; i++) {
            tmax = Math.max(tmax, happiness[i].Score);
            if (!tmin) {
                tmin = happiness[i].Score;
                continue;
            }
            tmin = Math.min(tmin, happiness[i].Score);
        }
        // console.log('min(Happiness)', tmin);
        // console.log('max(Happiness)', tmax);
        // got the min/max -> resolve so that the legend can be drawn
        $min.resolve(tmin);
        $max.resolve(tmax);

    });

    return $happiness;

});
