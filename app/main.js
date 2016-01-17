var zoom_level = 3,
    minZoom = 2,
    maxZoom = 17;

var AU = {
    lat: 47.683,
    lng: 14.912
};

// ----------------------------------------

$(document).ready(function(){

    var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: maxZoom,
            minZoom: minZoom,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
        latlng = L.latLng(AU.lat, AU.lng);
    var map = L.map('map', {
        center: latlng,
        zoom: zoom_level,
        layers: [tiles]
    });

    var countries = [];

    var filterCountries = ['SY', 'AF', 'IQ', 'PK', 'IR', 'SO', 'RU', 'NG', 'DZ', 'BD', 'UA', 'MA', 'IN'];

    var shpfile = new L.Shapefile('static/shape/TM_WORLD_BORDERS_SIMPL-0.3.zip', {
        onEachFeature: function(feature, layer) {
            //console.log('feature', feature);
            if (feature.properties) {
                if (['AT'].indexOf(feature.properties.ISO2) !== -1) {

                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                    layer.setStyle({fillColor: '#FF0000', color: '#AA9999', weight: 3, fillOpacity: 0.8});

                } else if (filterCountries.indexOf(feature.properties.ISO2) !== -1) {

                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                    layer.setStyle({fillColor: '#404040', color: '#202020', weight: 3});

                    countries.push(feature.properties);

                } else {

                    try {
                        layer.setStyle({fillColor: '#dddddd', color: '#333333', weight: 1, fillOpacity: 0.8});
                        //map.removeLayer(feature);
                        //feature.geometry.style.display = 'none';
                    } catch (err) {}

                }
            }
        }
    });
    shpfile.addTo(map);
    shpfile.once("data:loaded", function() {
        console.log("finished loaded shapefile");
        //remove loading anim
        $('#map').css('background-image', 'none');

        var i = 0,
            s = countries.length,
            country;
        for (i = 0; i < s; i++) {
            country = countries[i];
            //TODO: the curve behavior must be based on four quadrants
            var factor_lat = Math.abs(country.LAT - AU.lat) / 3;
            var factor_lng = Math.abs(country['LON'] - AU.lng) / 3;
            if (country['LAT'] > AU.lat) {factor_lat = -1 * factor_lat;}
            if (country['LON'] < AU.lng) {factor_lng = -1 * factor_lng;}
            //add the path
            var path = L.curve([
                        'M',[country['LAT'], country['LON']],
                        'C',[country['LAT'] + factor_lat, country['LON'] + factor_lng],
                            [AU.lat + factor_lat, AU.lng + factor_lng],
                            [AU.lat, AU.lng]
                    ],
                    {color:'#44A6A2',zIndex:999999,fill:false,opacity:0.8}).addTo(map);
            try {
                path.bringToFront();
            } catch (err) {}
        }//end for

        //remove loader
        $('#loader').animate({
            opacity: 0.25,
            top: "+=-10000",
            height: "toggle"
        }, 1000, function() {
            $('#loader').remove();
        });

    });

});
