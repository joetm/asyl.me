
var domain = 'https://en.wikipedia.org';


var scraperjs = require('scraperjs');

var scraper = scraperjs.StaticScraper;


// TODO: use $.Deferred
// http://taoofcode.net/promise-anti-patterns/



scraper.create('https://en.wikipedia.org/wiki/Category:International_border_crossings')
    .scrape(function($) {
        return $("#mw-subcategories ul li a").map(function() {
            return domain + $(this).attr('href');
        }).get();
    }).then(function(country_links) {
        // console.log(country_links);
        for (var i = 0, s = country_links.length; i < s; i++) {
            // scrape the country-level borders
            scraper.create(country_links[i])
                .scrape(function($) {
                    return $("#mw-subcategories ul li a").map(function() {
                        return domain + $(this).attr('href');
                    }).get();
                }).then(function(border_pages) {
                    // console.log(border_pages);
                    // not really interested in this level
                    for (var j = 0, t = border_pages.length; j < t; j++) {
                        // scrape the country-border
                        scraper.create(border_pages[j])
                            .scrape(function($) {
                                return $("#mw-pages ul li a").map(function() {
                                    return domain + $(this).attr('href');
                                }).get();
                            }).then(function(border_crossings) {
                                // this is the level with the border crossings at a specific border
                                // console.log(border_crossings);
                                for (var k = 0, u = border_crossings.length; k < u; k++) {
                                    // scrape the specific border crossing
                                    scraper.create(border_crossings[k])
                                        .scrape(function($) {
                                            var b = {};
                                                b.name = $('#firstHeading').text();
                                                b.latitude = $('.latitude').first().text();
                                                b.longitude = $('.longitude').first().text();
                                            console.log(b);
                                            return b;
                                    }).then(function(b) {
                                         console.log(b);
                                         // save the border crossings...



                                    });
                                }// for
                        });
                    }// for
                });
        }// for

    });

