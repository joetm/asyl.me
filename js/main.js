// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

// based on https://blog.tompawlak.org/number-currency-formatting-javascript
Number.prototype.formatNumber = function () {
    var num = this;
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

var load_csv = function (url, querytype) {
    if (querytype === undefined) {
        querytype = "text";
    }
    return $.ajax({
        url: url,
        dataType: querytype
    })
        .fail(function (msg) {
            console.error(msg);
        });
};

var get_happiness = function (countryname, happiness) {
    var score = 'unknown';
    for (var i = 0, s = happiness.length; i < s; i++) {
        if (happiness[i].Country === countryname) {
            score = happiness[i].Score;
            break;
        }
    }
    if (!(score >= 0)) {
        score = 'unknown';
    }
    return score;
};

var get_property = function (countryname, obj, key) {
    var score = 0;

    // debug to improve data quality
    if (obj[countryname] === undefined) {
        console.debug(key+':', countryname + ' not found');
        return;
    }
    // debug to improve data quality
    if (obj[countryname][key] === undefined) {
        console.debug(key+':', key + ' not found');
        return;
    }

    if (
        obj[countryname] !== undefined
        && obj[countryname][key] !== undefined
    ) {
        score = obj[countryname][key];
    }
    return score;
};


// -------------------------------------------------------------


var $map = $.Deferred();

var $happiness = $.Deferred();
var $shades = $.Deferred();
var $countries = $.Deferred();
var $population = $.Deferred();
var $areas = $.Deferred();
var $gdp = $.Deferred();
var $conflicts = $.Deferred();

var $bordercrossing_layer = $.Deferred();
var $happiness_layer = $.Deferred();

var $min = $.Deferred();
var $max = $.Deferred();

var $info_detail = $.Deferred();


// -------------------------------------------------------------


$(function(){

    // remove the loader
    $('#loader').addClass('done');

    // leaflet map
    var map = L.map('map', {
        center: L.latLng(47.5133586, 10.1074008),
        zoom: config.zoom_level,
        animate: config.animate,
        layers: [ baseMaps.tiles ]
    });
    $map.resolve(map);


    // -------------------------------------------------------------
    // AJAX queries
    // -------------------------------------------------------------
    // Happiness index
    // https://docs.google.com/spreadsheets/d/1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04/pub?output=csv
    var $happiness_query = load_csv("data/happiness/world-happiness-index.csv");
    // Country shapes
    var $country_query = load_csv("data/country/countries.geojson", 'json');
    // Border crossings
    var $bordercrossings_query = load_csv("data/bordercrossings/bordercrossings.geojson", 'json');
    // World population
    // https://docs.google.com/spreadsheets/d/1-lhti1yTM5CjlMTz3Hc_VqEnVTxbhoIS8WjUetmIWHs/pub?output=csv
    var $population_query = load_csv("data/population/population.csv");
    // Country areas
    // https://docs.google.com/spreadsheets/d/1KFjJ0AlYqeSOoUP5s8NGq4KUmZF65YeZc6m6WojwOHM/pub?output=csv
    var $area_query = load_csv("data/area/countries-area.csv");
    // GDP per capita (PPP) - IMF
    // https://docs.google.com/spreadsheets/d/1UIcp17LmWvzU1hZariKyvL6Gs81wWetMXCo99x49g1o/pub?output=csv
    var $gdp_query = load_csv("data/gdp/gdp.csv");
    // https://en.wikipedia.org/wiki/List_of_ongoing_armed_conflicts
    // https://docs.google.com/spreadsheets/d/1ZbOJhE7iBnUv1einXe6Ri5MqQKIfgwsrNoJLEMdZXMs/pub?output=csv
    var $conflicts_query = load_csv("data/war/war.csv");


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
        $conflicts.resolve(conflicts);
    });

    $.when($gdp_query).done(function (gdp_data) {
        if (!gdp_data) {
            $gdp_query.reject('Could not load gdp');
            return;
        }
        gdp_data = Papa.parse(gdp_data, {
                        delimiter: ",",
                        newline: "",
                        header: true,
                        dynamicTyping: true
            });
        gdp_data = gdp_data.data;
        var gdp = {};
        $.each(gdp_data, function (index, item) {
            if (typeof item.IntDollar === 'string') {
                // console.log(item);
                // fix the number
                item.IntDollar = parseInt(item.IntDollar.replace(/,/g, ''), 10);
            }
            // build the keyed gdp object
            gdp[item.Country] = item;
        });
        console.log('gdp', gdp);
        $gdp.resolve(gdp);
    });

    $.when($area_query).done(function (area_data) {
        // process, format and convert the area data into a keyed object
        if (!area_data) {
            $population.reject('Could not load area data');
            return;
        }
        area_data = Papa.parse(area_data, {
                        delimiter: ",",
                        newline: "",
                        header: true,
                        dynamicTyping: true
            });
        area_data = area_data.data;
        // console.log('area_data', area_data);
        var areas = {};
        var keys = ['Land in km2 (mi2)', 'Total in km2 (mi2)', 'Water in km2 (mi2)'];
        var newkeys = {
            'Land in km2 (mi2)': 'Land',
            'Total in km2 (mi2)': 'Total',
            'Water in km2 (mi2)': 'Water'
        };
        var newkey = '';
        for (var i = 0, s = area_data.length; i < s; i++) {
            // split the miles
            // or remove the miles
            $.each(keys, function (index, key) {
                if(
                    area_data[i].hasOwnProperty(key) &&
                    typeof area_data[i][key] === 'string'
                ) {
                    area_data[i][key] = area_data[i][key]
                                                .replace(/\s*\([\d\.\,]+\)/g, '');
                    // convert what's left into a usable number
                    area_data[i][key] = parseInt(area_data[i][key].replace(/,/g, ''), 10);
                    // rename the key
                    newkey = newkeys[key]; // key.replace(/\s*in\skm2\s*\(mi2\)/g, '');
                    // rename the keys
                    area_data[i][newkey] = area_data[i][key];
                    delete area_data[i][key];
                }
            });
            areas[area_data[i].Country] = area_data[i];
        }
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


    // -------------------------------------------------------------


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
            //if (remapping[happiness[i].Country] !== undefined) {
            //    happiness[i].Country = remapping[happiness[i].Country];
            //    // console.log('remapped', happiness[i]);
            //}
            shades[happiness[i].Country] = 100 - happiness[i].Score / max * 100;
        }
        // console.log('shades', shades);
        $shades.resolve(shades);
    });

    // ---------------------
    // panels
    // ---------------------

    // options in bottom left
    /*
    $.when(templates).done(function (templates) {
        var info_options = L.control({position: 'bottomleft'});
        info_options.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info selector');
            div.innerHTML = templates.info_options;
            return div;
        };
        info_options.addTo(map);
    });
    */

    // info panel in top right
    $.when(templates).done(function (templates) {
        info_panel.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info panel');
            div.innerHTML = 'Choose your origin'; // info_panelTpl({name: 'Country'});
            // initially hidden
            // L.DomUtil.addClass(div, 'hidden');
            return div;
        };
        info_panel.addTo(map);
    });

    // (debug) info panel at bottom right
    $.when(templates).done(function (templates) {
        info_detail.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info detail');
            // initially hidden
            L.DomUtil.addClass(div, 'hidden');
            L.DomUtil.addClass(div, 'pull-right');
            L.DomUtil.addClass(div, 'bottomright');
            div.innerHTML = info_detailTpl({name: 'Country'});
            return div;
        };
        info_detail.addTo(map);
        $('.info.debug').parent('div').addClass('debug');
        $info_detail.resolve(info_detail);
    });

    // legend (bottom right)
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
            L.DomUtil.addClass(div, 'pull-right');
            L.DomUtil.addClass(div, 'bottomright');
            return div;
        };
        legend.addTo(map);
    });


    // ---------------------

    // process the shapes and shades data
    $.when($countries, $happiness, $population, $areas, $gdp, $shades, $max, $info_detail).done(function (countries, happiness, population, areas, gdp, shades, max, info_detail) {

        // console.log('countries', countries);
        var happiness_layer = L.geoJson(countries, {
            // style: config.defaultStyle,
            onEachFeature: function(feature, layer) {

                // happiness
                feature.properties.happiness = get_happiness(feature.properties.name, happiness);

                // gdp
                feature.properties.gdp = get_property(feature.properties.name, gdp, 'IntDollar');
                // TODO: fix GDP for Syria

                // population
                feature.properties.population = get_property(feature.properties.name, population, 'Population');

                // area
                feature.properties.area = get_property(feature.properties.name, areas, 'Land');

                // population per area
                feature.properties.ppa = 0;
                if (
                    feature.properties.area > 0
                ) {
                    if (!feature.properties.population) {
                        feature.properties.population = 0;
                    }
                    feature.properties.ppa = feature.properties.population / feature.properties.area;
                }




                // set coloring / shading
                layer.setStyle(config.defaultStyle);
                if (shades[feature.properties.name] !== undefined) {
                    layer.setStyle({
                        fillColor: 'hsl(66, 22%, ' + (max*10 - shades[feature.properties.name]) + '%)'
                    });
                }




                // console.log('feature', feature);
                // console.log('layer', layer);

                layer.on("click", function (e) {
                    // console.log(this.feature.properties.name, this.options.fillColor);
                    // panel with debug info
                    info_detail._container.innerHTML = info_detailTpl({
                        name: this.feature.properties.name,
                        happiness: feature.properties.happiness,
                        population: feature.properties.population.formatNumber(),
                        area: feature.properties.area.formatNumber(),
                        ppa: feature.properties.ppa.toFixed(2), // round to two decimals
                        gdp: feature.properties.gdp.formatNumber()
                    });
                    // content for top right panel
                    info_panel._container.innerHTML = info_panelTpl({
                        name: this.feature.properties.name
                    });
                    // TODO:
                    // reset style of all layers to the happiness styling





// function to reset layers
happiness_layer.eachLayer(function(l){happiness_layer.resetStyle(l);});









//TODO:
//fix click on Greece and Greece data












                    // highlight the selected country
                    var l = e.target;
                    l.setStyle({
                        fillOpacity: 0.2
                    });

                    /*
                    // console.log(ppa);
                    if (ppa >= config.gdp.green) {
                        // console.log('gdp green');
                        $('.info.detail .gdp').css('color', 'green');
                    } else {
                        // console.log('gdp normal');
                        $('.info.detail .gdp').css('color', 'inherit');
                    }
                    */
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
        $happiness_layer.resolve(happiness_layer);
        // happiness_layer.bringToBack();
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


    // ---------------------

    // selector change
    $('.map .info.selector select').on('change', function () {
        alert('reloading');
        console.log('reloading');
    });


    // let's check the border crossings
    $.when($bordercrossings_query).done(function (bordercrossing_data) {
        var bordercrossing_layer = L.geoJson(bordercrossing_data, {
            pointToLayer: function (feature, latlng) {
                // circles instead of markers
                feature.properties.radius = 50;
                return circle = L.circle(latlng, feature.properties.radius, {
                    radius: 10,
                    //stroke: true,
                    //weight: 2,
                    color:'#ff0000',
                    fillColor:'#ef8080'
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.name);
            }
        }); //.addTo(map)
        // bordercrossing_layer.bringToFront();
        $bordercrossing_layer.resolve(bordercrossing_layer);
    });

    // overlays
    $.when($bordercrossing_layer, $happiness_layer).done(function (bordercrossing_layer, happiness_layer) {

        overlayMaps['Happiness Score'] = happiness_layer;
        overlayMaps['Border Crossings'] = bordercrossing_layer;

        var control = L.control.layers(overlayMaps).addTo(map);
        control.setPosition('bottomleft');

    });

});
