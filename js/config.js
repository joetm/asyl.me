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
    },
    gdp: {
        green: 25
    }
};

var baseMaps = {
    // OSM tiles
    "tiles": L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: config.maxZoom,
            minZoom: config.minZoom,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    })
};
var overlayMaps = {};

// some of the countries do not match
var remapping = {
    'United States': 'United States of America',
    'Tanzania': 'United Republic of Tanzania',
    'Serbia': 'Republic of Serbia'
};