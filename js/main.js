/**********/
/* CONFIG */
/**********/

var config = {
    maxZoom: 17,
    minZoom: 2,
    zoom_level: 3,
    animate: true,
    highlightStyle: {
        radius: 2,
        fillColor: "#FFFFFF",
        color: "#FBF0FD",
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0
    },
    defaultStyle: {
        radius: 2,
        fillColor: "#888888",
        color: "#FBF0FD",
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.8
    }
};

// some of the countries do not match
var remapping = {
    'United States': 'United States of America',
    'Tanzania': 'United Republic of Tanzania',
    'Serbia': 'Republic of Serbia'
};

/*************/
/* TEMPLATES */
/*************/

var templates = {};
templates.info_detail = '<div class="info">' +
                            '<h2>{{=it.name}}</h2>' +
                            '<div>Happiness:  {{=it.happiness}}</div>' +
                            '<div>Population: {{=it.population}}</div>' +
                            '<div>Population per km<sup>2</sup>: TODO</div>' +
                        '</div>';
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
var info_detailFn = doT.template(templates.info_detail);


// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

// based on https://blog.tompawlak.org/number-currency-formatting-javascript
Number.prototype.formatNumber = function () {
    var num = this;
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

// -------------------------------------------------------------


var $happiness = $.Deferred();
var $shades = $.Deferred();
var $countries = $.Deferred();
var $population = $.Deferred();
var $areas = $.Deferred();

var $min = $.Deferred();
var $max = $.Deferred();

var $info_detail = $.Deferred();


// -------------------------------------------------------------


$(function(){

    // remove the loader
    $('#loader').addClass('done');

    // OSM tiles
    var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: config.maxZoom,
            minZoom: config.minZoom,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
        latlng = L.latLng(47.5133586, 10.1074008);

    // leaflet map
    var map = L.map('map', {
        center: latlng,
        zoom: config.zoom_level,
        animate: config.animate,
        layers: [tiles]
    });


    // -------------------------------------------------------------
    // AJAX queries
    // -------------------------------------------------------------
    // Happiness index
    // https://docs.google.com/spreadsheets/d/1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04/pub?output=csv
    var $happiness_query = $.ajax({
        url: 'data/happiness/world-happiness-index.csv',
        dataType: "text"
    })
        .fail(function (msg) {
            console.error(msg);
        });
    // Country shapes
    var $country_query = $.getJSON("data/country/countries.geojson")
        .fail(function (msg) {
            console.error(msg);
        });
    // World population
    // https://docs.google.com/spreadsheets/d/1-lhti1yTM5CjlMTz3Hc_VqEnVTxbhoIS8WjUetmIWHs/pub?output=csv
    var $population_query = $.ajax({
            url: "data/population/population.csv",
            dataType: "text"
    })
        .fail(function (msg) {
            console.error(msg);
        });
    // Country areas
    // https://docs.google.com/spreadsheets/d/1KFjJ0AlYqeSOoUP5s8NGq4KUmZF65YeZc6m6WojwOHM/pub?output=csv
    var $area_query = $.ajax({
            url: "data/area/countries-area.csv",
            dataType: "text"
    })
        .fail(function (msg) {
            console.error(msg);
        });
    // -------------------------------------------------------------


    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

    $.when($country_query).done(function (country_data) {
        if (!country_data) {
            $country_query.reject('Could not load countries');
            return;
        }
        var countries = country_data.features;
        // console.log('countries', countries);
        $countries.resolve(countries);
    });


    $.when($area_query).done(function (area_data) {
        if (!area_data) {
            $population.reject('Could not load area data');
            return;
        }

        // process, format and convert the area data into a keyed object

        area_data = area_data.split("\n");
        area_data = area_data.map(function (p) {
            return p.replace(/"/g, '').split(',');
        });










        var areas = area_data;
        console.log('areas', areas);
        $areas.resolve(areas);
    });

    $.when($population_query).done(function (population_data) {
        if (!population_data) {
            $population.reject('Could not load population data');
            return;
        }
        //population_data = population_data.split("\n");
        //population_data = population_data.map(function (p) {
            // split the rows by ',' and remove '"' from each value in the array
            // return p.split(',');
            //.map(function (t) {
            //    return t.replace(/"/g, '');
            //});
        //    return p;
        //});

        population_data = Papa.parse(population_data, {
                        delimiter: ",",
                        newline: "",
                        header: true,
                        dynamicTyping: true
            });

        population_data = population_data.data;

        /*
        for (var i = 0, s = population_data.length; i < s; i++) {
            if (
                population_data[i].Population !== undefined &&
                typeof population_data[i].Population === 'string'
            ) {
                population_data[i].Population = parseInt(population_data[i].Population.replace(/,/g, ''), 10);
            }
        }
        */

        var population = {};

        for (var i = 0, s = population_data.length; i < s; i++) {
            // fix the nasty country key
            for(var key in population_data[i]) {
                if(
                    population_data[i].hasOwnProperty(key) &&
                    typeof population_data[i][key] === 'string'
                ) {
                    population_data[i][key] = population_data[i][key]
                                                .replace(/\s*\[Note\s\d+\]/g, '')
                                                .replace(/\s*\*\([a-z,\.\-\s]+\)\*/gi, '')
                                                .replace(/[\*\"]/g, '');
                    // fix population figure
                    if (key === 'Population') {
                        population_data[i][key] = parseInt(population_data[i][key].replace(/,/g, ''), 10);
                    }
                }
            }
            population[population_data[i]['Country (or dependent territory)']] = population_data[i];
        }

        // console.log('population_data', population_data);

        console.log('population', population);

        $population.resolve(population);
    });


    $.when($happiness_query).done(function (happiness_data) {

        if (!happiness_data) {
            $happiness_data.reject('Could not load happiness data');
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

    });



    // -------------------------------------------------------------

    $.when($happiness).done(function (happiness) {
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
        console.log('min(Happiness)', tmin);
        console.log('max(Happiness)', tmax);
        // got the min/max -> resolve so that the legend can be drawn
        $min.resolve(tmin);
        $max.resolve(tmax);
    });


    // create an array of color shadings
    $.when($countries, $happiness, $max).done(function (countries, happiness, max) {
        // console.log('building shading');
        // console.log(countries);
        // console.log(happiness);
        // create a shading range
        var shades = {};
        for (var i = 0, s = happiness.length; i < s; i++) {
            // does the country name need to be remapped?
            // console.log(remapping[happiness[i]['Country']]);
            if (remapping[happiness[i].Country] !== undefined) {
                happiness[i].Country = remapping[happiness[i].Country];
                console.log('remapped', happiness[i]);
            }
            shades[happiness[i].Country] = 100 - happiness[i].Score / max * 100;
        }
        // console.log('shades', shades);
        $shades.resolve(shades);
    });


    // ---------------------
    // options in bottom left
    // ---------------------
    $.when(templates).done(function (templates) {
        var info_options = L.control({position: 'bottomleft'});
        info_options.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info selector');
            div.innerHTML = templates.info_options;
            return div;
        };
        info_options.addTo(map);
    });


    // ---------------------
    // info panel at top right
    // ---------------------
    $.when(templates).done(function (templates) {
        var info_detail = L.control({position: 'topright'});
        info_detail.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info detail');
            L.DomUtil.addClass(div, 'hidden');
            div.innerHTML = info_detailFn({name: 'Country'});
            return div;
        };
        info_detail.addTo(map);
        $info_detail.resolve(info_detail);
    });

    // ---------------------
    // legend (bottom right)
    // ---------------------
    // TODO: adjust the colors to match the country shading
    $.when($min, $max).done(function (min, max) {
        function getLegendColor(d){
            return 'hsl(66, 22%, ' + (d * 10) + '%)';
        }
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                // generate integer range
                // see http://stackoverflow.com/a/10050831/426266
                grades = Array.apply(null, Array(parseInt(max + 1, 10))).map(function (_, i) {return i;}),
                labels = [];
            // console.log(grades);
            // header?
            // div.innerHTML += '<div>Happiness<br />Index</div>';
            // color for countries with no data:
            div.innerHTML +=
                '<div><i style="background:'+config.defaultStyle.fillColor+'"></i> ?' + '</div>';
            // loop through shades intervals and generate a label with a colored square for each interval
            var diff = parseInt(min, 10) + 1;
            for (var i = diff; i < grades.length; i++) {
                div.innerHTML +=
                    '<div><i style="background:' + getLegendColor(grades[i - diff] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')+'</div>';
            }
            return div;
        };
        legend.addTo(map);
    });


    // process the shapes and shades data
    $.when($countries, $happiness, $population, $shades, $max, $info_detail).done(function (countries, happiness, population, shades, max, info_detail) {
        function get_happiness (countryname) {
            var score = 'unknown';
            for (var i = 0, s = happiness.length; i < s; i++) {
                if (happiness[i].Country === countryname) {
                    score = happiness[i].Score;
                    break;
                }
            }
            return score;
        }

        // console.log('countries', countries);
        L.geoJson(countries, {
            style: config.defaultStyle,
            onEachFeature: function(feature, layer) {
                // get the happiness data
                var h = get_happiness(feature.properties.name);
                if (!h) {
                    h = 'unknown';
                }
                // population
                var p = false;
                if (
                    population[feature.properties.name] !== undefined
                    && population[feature.properties.name].Population !== undefined
                ) {
                    p = population[feature.properties.name].Population.formatNumber();
                }
                // shading
                // console.log(feature.properties.name, 'hsl(66, 22%, ' + (max*10 - shades[feature.properties.name]) + '%)');
                if (shades[feature.properties.name] !== undefined) {
                    layer.setStyle({
                        fillColor: 'hsl(66, 22%, ' + (max*10 - shades[feature.properties.name]) + '%)'
                    });
                }
                layer.on("click", function (e) {
                    // console.log(this.feature.properties.name, this.options.fillColor);
                    info_detail._container.innerHTML = info_detailFn({
                        name: this.feature.properties.name,
                        happiness: h,
                        population: p
                    });
                    // show the info container
                    L.DomUtil.removeClass(info_detail._container, 'hidden');
                });
                /*
                layer.on("mouseover", function (e) {
                    // console.log(layer.options.style);
                    layer.options.origstyle = layer.options.style;
                    layer.setStyle(config.highlightStyle);
                });
                layer.on("mouseout", function (e) {
                    // console.log('origstyle', layer.options.origstyle);
                    layer.setStyle(layer.options.origstyle);
                });
                */
            }
        }).addTo(map);
    });

    /*
    // taking data from Google Sheet with parsed Wikipedia data
    // this works, but is too likely to break the site when changes are made
    try {
        // Happiness
        Tabletop.init({
            key: "1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04",
            callback: initApp,
            simpleSheet: true
        });
        // GDP
        //Tabletop.init({
        //    key: "1UIcp17LmWvzU1hZariKyvL6Gs81wWetMXCo99x49g1o",
        //    callback: initApp,
        //    simpleSheet: true
        //});
    } catch (err) {
        console.error(err);
        document.getElementById('map').innerHTML = 'Error: '+err;
        return;
    }
    */


    // selector change
    $('.map .info.selector select').on('change', function () {
        alert('reloading');
        console.log('reloading');
    });

}());
