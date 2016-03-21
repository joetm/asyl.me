var config = {
    maxZoom: 17,
    minZoom: 2,
    zoom_level: 3,
    animate: true
};

var highlightStyle = {
    radius: 2,
    fillColor: "#FFFFFF",
    color: "#FBF0FD",
    weight: 1,
    opacity: 0.9,
    fillOpacity: 0
};
var defaultStyle = {
    radius: 2,
    fillColor: "#888888",
    color: "#FBF0FD",
    weight: 1,
    opacity: 0.9,
    fillOpacity: 0.8
};

// some of the countries do not match
var remapping = {
    'United States': 'United States of America',
    'Tanzania': 'United Republic of Tanzania',
    'Serbia': 'Republic of Serbia'
};

var shades = [];

var happiness;
var min;
var max = 0;


$(function(){


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



    var remove_loader = function () {
        // $('body').css('background-color', '#FFFFFF');
        $('body').css({
            backgroundColor  : '#FFFFFF',
            opacity: 1,
            WebkitTransition : 'opacity 2s ease-in-out',
            MozTransition    : 'opacity 2s ease-in-out',
            MsTransition     : 'opacity 2s ease-in-out',
            OTransition      : 'opacity 2s ease-in-out',
            transition       : 'opacity 2s ease-in-out'
        });
    };

    // World Happiness Index
    /*
    Papa.parse("https://docs.google.com/spreadsheets/d/1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04/export?format=csv", {
        download: true,
        delimiter: "",  // auto-detect
        newline: "",    // auto-detect
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log("Finished:", results.data);
        }
    });
    */


    /*
    // CORS issue
    $.get("https://docs.google.com/spreadsheets/d/1L3yKGh7qN1OLrUeG7AAU5YSVLZQ2a9oE7oU13phlR04/pub?output=csv", function (data) {
        console.log(data);
    });
    */

    function initApp() {

        $('#loader').addClass('done');

        // remove_loader();

        var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                maxZoom: config.maxZoom,
                minZoom: config.minZoom,
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }),
            latlng = L.latLng(47.5133586, 10.1074008);

        var map = L.map('map', {
            center: latlng,
            zoom: config.zoom_level,
            animate: config.animate,
            layers: [tiles]
        });



        var hajax = $.ajax({
            url: 'data/happiness/world-happiness-index.csv',
            dataType: "text"
        });
        hajax.done(function (data) {

            // console.log(data);
            if (!data) return;

            var parsed_happiness = [],
                tmp,
                keys;

            // split into rows
            data = data.split("\n");

            // get the keys
            keys = data[0].split(",").map(function (key) { return key.replace(/"/g, ''); });
            // remove the header row
            delete data[0];
            // console.log(keys);

            // loop through the rows
            for (var i = 0, s = data.length; i < s; i++) {
                if (data[i] === undefined) continue;
                data[i] = data[i].split(',');
                // console.log(data[i][2]);
                // loop through keys
                tmp = {};
                for (var j = 0, t = keys.length; j < t; j++) {
                    if (data[i][j] === undefined) {
                        continue;
                    }
                    tmp[keys[j]] = data[i][j];
                }
                parsed_happiness.push(tmp);
            }

            //convert the number strings
            happiness = parsed_happiness.map(function (obj) {
                obj.Rank = parseInt(obj.Rank, 10);
                obj.Score = parseFloat(obj.Score);
                return obj;
            });

            // console.log(happiness);

            for (var i = 0, s = happiness.length; i < s; i++) {
                max = Math.max(max, happiness[i].Score);
                if (!min) {
                    min = happiness[i].Score;
                } else {
                    min = Math.min(min, happiness[i].Score);
                }
            }
            console.log('min(Happiness)', min);
            console.log('max(Happiness)', max);

            // create a shading range
            for (var i = 0, s = happiness.length; i < s; i++) {
                // console.log(remapping[happiness[i]['Country']]);
                if (remapping[happiness[i]['Country']] !== undefined) {
                    data[i]['Country'] = remapping[happiness[i]['Country']];
                    console.log('remapped', happiness[i]);
                }
                shades[happiness[i]['Country']] = 100 - happiness[i].Score / max * 100;
            }
            // console.log(shades);


            // -------
            // legend
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
                    '<div><i style="background:'+defaultStyle.fillColor+'"></i> ?' + '</div>';
                // loop through shades intervals and generate a label with a colored square for each interval
                for (var i = 1; i < grades.length; i++) {
                    div.innerHTML +=
                        '<div><i style="background:' + getLegendColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')+'</div>';
                }
                return div;
            };
            legend.addTo(map);


            var info_options = L.control({position: 'bottomleft'});
            info_options.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info selector');
                div.innerHTML = templates.info_options;
                return div;
            };
            info_options.addTo(map);



            var info_detailFn = doT.template(templates.info_detail);


            var info_detail = L.control({position: 'topright'});
            info_detail.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info detail');
                div.innerHTML = info_detailFn({name: 'ertrrrr'});
                return div;
            };
            info_detail.addTo(map);



            $.getJSON("data/country/countries.geojson", function(data) {
                L.geoJson([data], {
                    style: defaultStyle,
                    onEachFeature: function(feature, layer) {
                        // console.log(feature.properties.name, (max*10 - shades[feature.properties.name]));
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
                            layer.setStyle(highlightStyle);
                        });
                        layer.on("mouseout", function (e) {
                            // console.log('origstyle', layer.options.origstyle);
                            layer.setStyle(layer.options.origstyle);
                        });
                        */
                    }
                }).addTo(map);
            });


        });






    }//initApp


    initApp();


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


});
