/**
 * Templates
 * @module
 */

/*global define*/

define(['doT', 'leaflet'], function (doT, L) {
    'use strict';

    var templates = {};

    templates.tpl = {};

    // debug panel
    templates.tpl.info_detail = '<div class="info debug">' +
                        '<div>Happiness:  <span class="happiness">{{=it.happiness}}</span></div>' +
                        '<div>Population: <span class="population">{{=it.population}}</span></div>' +
                        '<div>Area (km<sup>2</sup>): <span class="area">{{=it.area}}</span></div>' +
                        '<div>Population per km<sup>2</sup>: <span class="ppa">{{=it.ppa}}</span></div>' +
                        '<div>GDP-PPP (Int$): <span class="gdp">{{=it.gdp}}</span></div>' +
                    '</div>';
    templates.info_detailTpl = doT.template(templates.tpl.info_detail);
    templates.info_detail = L.control({position: 'bottomright'});

    templates.tpl.info_panel = '<div class="col-xs-12">' +
                            '<h2>{{=it.name}}</h2>' +
                            'Details here' +
                            '</div>';
    templates.info_panelTpl = doT.template(templates.tpl.info_panel);
    templates.info_panel = L.control({position: 'topright'});

    return templates;

});
