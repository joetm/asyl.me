/*************/
/* TEMPLATES */
/*************/

var templates = {};
// debug panel
templates.info_detail = '<div class="info debug">' +
                            '<div>Happiness:  <span class="happiness">{{=it.happiness}}</span></div>' +
                            '<div>Population: <span class="population">{{=it.population}}</span></div>' +
                            '<div>Area (km<sup>2</sup>): <span class="area">{{=it.area}}</span></div>' +
                            '<div>Population per km<sup>2</sup>: <span class="ppa">{{=it.ppa}}</span></div>' +
                            '<div>GDP-PPP (Int$): <span class="gdp">{{=it.gdp}}</span></div>' +
                        '</div>';
var info_detailTpl = doT.template(templates.info_detail);
var info_detail = L.control({position: 'bottomright'});
/*
templates.info_options = '<div class="col-1 col-xs-12 col-sm-6">' +
                            '<select>' +
                                '<option value="happiness" selected="selected">World Happiness Index</option>' +
                                '<option value="gdp">GDP per capita</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="col-2 col-xs-12 col-sm-6">' +
                            '<label>' +
                                '<input type="checkbox" name="bordercrossings" value="1" /> Show border crossings' +
                            '</label>' +
                        '</div>';
*/
templates.info_panel = '<div class="col-xs-12">' +
                        '<h2>{{=it.name}}</h2>' +
                        'Details here' +
                        '</div>';
var info_panelTpl = doT.template(templates.info_panel);
var info_panel = L.control({position: 'topright'});
