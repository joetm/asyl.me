/**
 * MinMax
 * @module
 * @return Promise
 */

/*global define*/

// TODO:
// write this, so that any data can be processed









define(['happiness'], function ($happiness) {
    'use strict';

    var $minmax = $.Deferred();

    // console.log('minmax:module', module);

    $.when($happiness).done(function (happiness) {

        console.log('minmax:happiness', happiness);

        // calculate min/max happiness
        var tmax = 0,
            tmin;
        var keys = Object.keys(happiness);
        for (var i = 0, s = keys.length; i < s; i++) {
            tmax = Math.max(tmax, happiness[keys[i]].Score);
            if (!tmin) {
                tmin = happiness[keys[i]].Score;
                continue;
            }
            tmin = Math.min(tmin, happiness[keys[i]].Score);
        }
        // console.log('min(Happiness)', tmin);
        // console.log('max(Happiness)', tmax);
        // got the min/max -> resolve so that the legend can be drawn
        var minmax = {
            min: tmin,
            max: tmax
        };

        $minmax.resolve(minmax);;
        // console.log('minmax:minmax', minmax);

    });

    return $minmax;

});
