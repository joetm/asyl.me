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
                            '{{=it.name}}' +
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



var $happiness = $.Deferred();
var $shades = $.Deferred();
var $countries = $.Deferred();

var $min = $.Deferred();
var $max = $.Deferred();

var $info_detail = $.Deferred();


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
    // get the happiness data
    var $happiness_query = $.ajax({
        url: 'data/happiness/world-happiness-index.csv',
        dataType: "text"
    })
        .fail(function (msg) {
            console.error(msg);
        });
    // get the country shapes
    var $country_query = $.getJSON("data/country/countries.geojson")
        .fail(function (msg) {
            console.error(msg);
        });
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


    $.when($happiness_query).done(function (happiness_data) {

        if (!happiness_data) {
            $happiness_data.reject('Could not load happiness data');
            return;
        }

        var parsed_happiness = [],
            tmp,
            keys;

        // split into rows
        happiness_data = happiness_data.split("\n");
        // console.log('happiness_data', happiness_data);

        // get the keys
        keys = happiness_data[0].split(",").map(function (key) { return key.replace(/"/g, ''); });
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

        var tmax = 0,
            tmin;
        for (var i = 0, s = happiness.length; i < s; i++) {
            tmax = Math.max(tmax, happiness[i].Score);
            if (!tmin) {
                tmin = happiness[i].Score;
            } else {
                tmin = Math.min(tmin, happiness[i].Score);
            }
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
            if (remapping[happiness[i]['Country']] !== undefined) {
                happiness[i]['Country'] = remapping[happiness[i]['Country']];
                console.log('remapped', happiness[i]);
            }
            shades[happiness[i]['Country']] = 100 - happiness[i].Score / max * 100;
        }
        console.log('shades', shades);
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
            div.innerHTML = info_detailFn({name: 'Country'});
            return div;
        };
        info_detail.addTo(map);
        $info_detail.resolve(info_detail);
    });

    // ---------------------
    // legend (bottom right)
    // ---------------------
    $.when($min, $max).done(function (min, max) {
        function getLegendColor(d){
            return 'hsl(66, 22%, ' + (d * 10) + '%)';
        }
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                // generate integer range
                // see http://stackoverflow.com/a/10050831/426266
                grades = Array.apply(null, Array(parseInt(max + 1, 10))).map(function (_, i) {return i;}); // [0, 1, 2, 3, 4, 5, 6, 7],
                labels = [];
            // console.log(grades);
            // header?
            // div.innerHTML += '<div>Happiness<br />Index</div>';
            // color for countries with no data:
            div.innerHTML +=
                '<div><i style="background:'+config.defaultStyle.fillColor+'"></i> ?' + '</div>';
            // loop through shades intervals and generate a label with a colored square for each interval
            for (var i = 1; i < grades.length; i++) {
                div.innerHTML +=
                    '<div><i style="background:' + getLegendColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')+'</div>';
            }
            return div;
        };
        legend.addTo(map);
    });



    // process the shapes and shades data
    $.when($countries, $shades, $max, $info_detail).done(function (countries, shades, max, info_detail) {
        // console.log('countries', countries);
        L.geoJson(countries, {
            style: config.defaultStyle,
            onEachFeature: function(feature, layer) {
                // console.log(feature.properties.name, 'hsl(66, 22%, ' + (max*10 - shades[feature.properties.name]) + '%)');
                if (shades[feature.properties.name] !== undefined) {
                    layer.setStyle({
                        fillColor: 'hsl(66, 22%, ' + (max*10 - shades[feature.properties.name]) + '%)'
                    });
                }
                layer.on("click", function (e) {
                    // console.log(this.feature.properties.name, this.options.fillColor);
                    info_detail._container.innerHTML = info_detailFn({name: this.feature.properties.name});

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
