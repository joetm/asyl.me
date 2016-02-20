/*globals $, window*/

var site = {
    zoom_level: 3,
    minZoom: 2,
    maxZoom: 17,
    AU: {
        lat: 47.683,
        lng: 14.912
    }
};


// ----------------------------------------

$(document).ready(function (){

    var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: site.maxZoom,
            minZoom: site.minZoom,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
        latlng = L.latLng(site.AU.lat, site.AU.lng);
    var map = L.map('map', {
        center: latlng,
        zoom: site.zoom_level,
        layers: [tiles]
    });

    var countries = [];

    // TODO: get this from storage
    var filterCountries = ['GB', 'SY', 'AF', 'IQ', 'PK', 'IR', 'SO', 'RU', 'NG', 'DZ', 'BD', 'UA', 'MA', 'IN'];

    var shpfile = new L.Shapefile('static/shape/TM_WORLD_BORDERS_SIMPL-0.3.zip', {
        onEachFeature: function (feature, layer) {
            // console.log('feature', feature);
            if (feature.properties) {
                if (['AT'].indexOf(feature.properties.ISO2) !== -1) {

                    layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                    layer.setStyle({fillColor: '#FF0000', color: '#AA9999', weight: 3, fillOpacity: 0.8});

                } else if (filterCountries.indexOf(feature.properties.ISO2) !== -1) {

                    layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                    layer.setStyle({fillColor: '#404040', color: '#202020', weight: 3});

                    countries.push(feature.properties);

                } else {

                    try {
                        layer.setStyle({fillColor: '#dddddd', color: '#333333', weight: 1, fillOpacity: 0.8});
                        // map.removeLayer(feature);
                        // feature.geometry.style.display = 'none';
                    } catch (ignore) {}

                }
            }
        }
    });
    shpfile.addTo(map);
    shpfile.once("data:loaded", function () {
        console.log("finished loading shapefile");
        // remove loading anim
        $('#map').css('background-image', 'none');

        // I want to see the quadrants
        // vertical
        var opacity = 0.8;
        var vertical = new L.Polyline([new L.LatLng(-180, site.AU.lng), new L.LatLng(180, site.AU.lng)], {color: '#404040', weight: 2, opacity: opacity});
        vertical.addTo(map);
        // horizontal
        var horizontal = new L.Polyline([new L.LatLng(site.AU.lat, -180), new L.LatLng(site.AU.lat, 180)], {color: '#404040', weight: 2, opacity: opacity});
        horizontal.addTo(map);

        var i = 0,
            s = countries.length,
            country,
            v_diff = 0,
            h_diff = 0,
            factor_lat,
            factor_lng;
        for (i = 0; i < s; i++) {
            country = countries[i];
            // Quadrants:
            // 4 | 1
            // -----
            // 3 | 2
            v_diff = country.LAT - site.AU.lat;
            h_diff = country.LON - site.AU.lng;
            //Quadrant 1:
            if (v_diff > 0 && h_diff > 0) {
                country_factor_lat = v_diff*0.3;
                country_factor_lng = 0.75;
                site_factor_lat = v_diff*0.3;
                site_factor_lng = 1.25;
            }
            //Quadrant 2:
            if (v_diff < 0 && h_diff > 0) {
                country_factor_lat = v_diff*0.3;
                country_factor_lng = 0.75;
                site_factor_lat = v_diff*0.3;
                site_factor_lng = 1.25;
            }
            //Quadrant 3:
            if (v_diff < 0 && h_diff < 0) {
                country_factor_lat = -1 * v_diff*0.3;
                country_factor_lng = 1.25;
                site_factor_lat = v_diff*0.3;
                site_factor_lng = 0.75;
            }
            //Quadrant 4:
            if (v_diff > 0 && h_diff < 0) {
                country_factor_lat = v_diff*0.3;
                country_factor_lng = 0.75;
                site_factor_lat = v_diff*0.3;
                site_factor_lng = 0.75;
            }
            // add the path
            var path = L.curve([
                        'M',[country['LAT'], country['LON']],
                        'C',
                            [country['LAT'] + country_factor_lat, country['LON'] * country_factor_lng],
                            [site.AU.lat + site_factor_lat, site.AU.lng * site_factor_lng],
                            [site.AU.lat, site.AU.lng]
                    ],
                    //new L.Polyline([new L.LatLng(country['LAT'], country['LON']), new L.LatLng(site.AU.lat, site.AU.lng)],
                    {
                        color: '#44A6A2',
                        zIndex: 999999,
                        fill: false,
                        opacity: 0.8
                    }).addTo(map);
            try {
                path.bringToFront();
            } catch (ignore) {}
        }//end for

        // remove loader
        $('#loader').animate({
            opacity: 0.25,
            top: "+=-10000",
            height: "toggle"
        }, 1000, function () {
            $('#loader').remove();
        });

    });

});
