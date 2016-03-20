var category_urls = [];
var pages = [];
var domain = 'https://en.wikipedia.org';

var casper = require('casper').create({
    logLevel: 'error',
    verbose: true
});

var getCategories = function getCategories() {
    var links = document.querySelectorAll('#mw-subcategories ul li a');
    return Array.prototype.map.call(links, function(e) {
        return domain + e.getAttribute('href');
    });
}
var getCrossingList = function getCrossingList() {
    casper.log('getting crossings', 'info');
    var links = document.querySelectorAll('#mw-pages ul li a');
    casper.log('Found crossings: '+links.length, 'info');

    console.log('page links', links);
    this.echo(this.getTitle());
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}


casper.start();

casper.thenOpen('https://en.wikipedia.org/wiki/Category:Border_crossings_of_Germany', function() {
    category_urls = this.evaluate(getCategories);
});

casper.then(function () {
    console.log("\n", 'category_urls #:', category_urls.length);
    // console.log('category_urls:', category_urls);
});

/*
casper.eachThen(category_urls, function(response) {
    //console.log('sss', response.data);
    //this.thenOpen(response.data, function(response) {
    //    console.log('Opened', response.url);




    //});
});
*/

/*
casper.eachThen(categories, function(response) {
    casper.each(categories, function(self, webpage) {
        console.log('opening: ', domain+link);
        casper.thenOpen(domain+link, function() {
            this.echo('sss');
            var pages = this.evaluate(getCrossingList);
            // pages = pages.concat(this.evaluate(getPages));
            console.log('pages', pages);
        });
    });
});
*/


// aggregate results
casper.run(function() {

    // echo results
    this.echo(links.length + ' borders found:');
    // this.echo(' - ' + links.join('\n - '))

    this.echo(pages.length + ' border crossings found:');

    this.exit();
});