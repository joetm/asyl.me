(function(app) {
  app.MapComponent =
    /*
    ng.core.Component({
        selector: '#map',
        template: ''
    })
    .Class({
        constructor: function() {
        }
    });
    */
    ng.core.Component({
        selector: '#map',
        template: ''
    })
    .Class({
        constructor: function() {
            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    maxZoom: maxZoom,
                    minZoom: minZoom,
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
                latlng = L.latLng(47.683, 14.912);
            this.map = L.map('map', {
                center: latlng,
                zoom: zoom_level,
                layers: [tiles]
            });
            console.log(this.map);
        }
    });
})(window.app || (window.app = {}));