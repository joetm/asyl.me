/**
 * Panels
 * @module
 */

/*global define*/

define(['jquery', 'tpl', 'leaflet', 'map', 'config', 'helpers', 'happiness', 'minmax'], function ($, tpl, L, map, config, helpers, happiness, $minmax) {
    'use strict';

    // ---------------------
    // panels
    // ---------------------

    // info panel in top right
    tpl.info_panel.onAdd = function () {
        var div = L.DomUtil.create('div', 'info panel');
        div.innerHTML = 'Choose your origin'; // tpl.info_panelTpl({name: 'Country'});
        // initially hidden
        // L.DomUtil.addClass(div, 'hidden');
        return div;
    };
    tpl.info_panel.addTo(map);

    // (debug) info panel at bottom right
    tpl.info_detail.onAdd = function () {
        var div = L.DomUtil.create('div', 'info detail');
        // initially hidden
        L.DomUtil.addClass(div, 'hidden');
        L.DomUtil.addClass(div, 'pull-right');
        L.DomUtil.addClass(div, 'bottomright');
        div.innerHTML = tpl.info_detailTpl({name: 'Country'});
        return div;
    };
    tpl.info_detail.addTo(map);
    $('.info.debug').parent('div').addClass('debug');


    $.when($minmax).done(function (minmax) {
        // legend (bottom right)
        var legend = L.control({position: 'bottomright'});
        //legend.min = minmax.min;
        //legend.max = minmax.max;
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                // generate integer range
                // see http://stackoverflow.com/a/10050831/426266
                grades = Array.apply(null, Array(parseInt(minmax.max + 1, 10))).map(function (_, i) { return i; }),
                labels = [];
            // console.log(grades);
            // header?
            // div.innerHTML += '<div>Happiness<br />Index</div>';
            // color for countries with no data:
            div.innerHTML +=
                '<div><i style="background:'+config.defaultStyle.fillColor+'"></i> ?' + '</div>';
            // loop through shades intervals and generate a label with a colored square for each interval
            var diff = parseInt(minmax.min, 10) + 1;
            for (var i = diff; i < grades.length; i++) {
                div.innerHTML +=
                    '<div><i style="background:' + helpers.getLegendColor(grades[i - diff] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')+'</div>';
            }
            L.DomUtil.addClass(div, 'pull-right');
            L.DomUtil.addClass(div, 'bottomright');
            return div;
        };
        legend.addTo(map);
    });

});
