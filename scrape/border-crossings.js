
var domain = 'https://en.wikipedia.org';


var scraperjs = require('scraperjs');

var scraper = scraperjs.StaticScraper;

console.log('Scraping wikipedia border crossings');
console.log('This will take a while...', "\n");


// TODO: use $.Deferred
// http://taoofcode.net/promise-anti-patterns/

function ms_delay () {
    return 500;
}
var count = 0;
function delay_msg () {
    count++;
    console.log(count);
}

scraper.create('https://en.wikipedia.org/wiki/Category:International_border_crossings')
    .scrape(function($) {
        return $("#mw-subcategories ul li a").map(function() {
            return {
                country: $(this).text().replace('Border crossings of ', ''),
                link: domain + $(this).attr('href')
            };
        }).get();
    }).then(function(countries) {
        // console.log(countries);
        for (var i = 0, s = countries.length; i < s; i++) {
            // scrape the country-level borders
            scraper.create(countries[i].link)
                .delay(ms_delay(), delay_msg)
                .scrape(function($) {
                    return $("#mw-subcategories ul li a").map(function() {
                        return domain + $(this).attr('href');
                    }).get();
                })
                .then(function(border_pages) {
                    // console.log(border_pages);
                    // not really interested in this level
                    for (var j = 0, t = border_pages.length; j < t; j++) {
                        // scrape the country-border
                        scraper.create(border_pages[j])
                            .delay(ms_delay(), delay_msg)
                            .scrape(function($) {
                                return $("#mw-pages ul li a").map(function() {
                                    return domain + $(this).attr('href');
                                }).get();
                            })
                            .then(function(border_crossings) {
                                // this is the level with the border crossings at a specific border
                                // console.log(border_crossings);
                                for (var k = 0, u = border_crossings.length; k < u; k++) {
                                    // scrape the specific border crossing
                                    scraper.create(border_crossings[k])
                                        .scrape(function($) {
                                            var geo_page = $('#coordinates a.external').attr('href');
                                            if (geo_page) {
                                                // invalid URI?
                                                if (geo_page.indexOf('//') === 0) {
                                                    geo_page = 'http:' + geo_page;
                                                }
                                                // go one step further to fetch the un-formatted coords
                                                var b = scraper.create(geo_page)
                                                    //.delay(ms_delay(), delay_msg)
                                                    .scrape(function($) {
                                                        return $("#mw-pages ul li a").map(function() {
                                                            return domain + $(this).attr('href');
                                                        }).get();
                                                    })
                                                    .then(function(border_crossings) {
                                                        return {
                                                            latitude:  $('.geo').first().find('.latitude').text(),
                                                            longitude: $('.geo').first().find('.longitude').text()
                                                        };
                                                    });

                                                // capture the name of the border crossing
                                                b.name = $('#firstHeading').text();

                                                // border crossing
                                                console.log(b);
                                                return b;
                                            }
                                    }).then(function(b) {

                                        // console.log(b);

                                        // save the border crossings...



                                    });
                                }// for
                        });
                    }// for
                });
        }// for

    });

