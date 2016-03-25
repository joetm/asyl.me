$(function(){

    $.when($map).done(function (map) {

        //testing: drawing an arc
        var start = { x: 36.8027059, y: 34.794319 };
        var end = { x: -0.3817789, y: 51.528308 };
        var generator = new arc.GreatCircle(start, end, { name: 'Syria migration 1' });
        var line = generator.Arc(100, { offset: 10 });
        var arc1 = L.geoJson(line.json()).addTo(map);

        //L.DomUtil.addClass(line, 'front');

        var start = { x: 36.8027059, y: 34.794319 };
        var end = { x: 5.9677381, y: 51.0782036 };
        var generator = new arc.GreatCircle(start, end, { name: 'Syria migration 1' });
        var line = generator.Arc(100, { offset: 10 });
        var arc2 = L.geoJson(line.json()).addTo(map);

        //L.DomUtil.addClass(line, 'front');

    });

});