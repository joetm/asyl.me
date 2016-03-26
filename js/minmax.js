/**
 * MinMax
 * @module
 * @return Promise
 */

// TODO:
// write this, so that any data can be processed









define(['happiness'], function ($happiness) {
    'use strict';

    var $minmax = $.Deferred();

    // console.log('minmax:module', module);

    $happiness.done(function (happiness) {

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
        var minmax = {
            min: tmin,
            max: tmax
        };

        $minmax.resolve(minmax);;

    });

    return $minmax;

});
