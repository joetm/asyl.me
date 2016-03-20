var categories = [];
var pages = [];

var casper = require('casper').create();

function getCategories() {
    var links = document.querySelectorAll('#mw-subcategories ul li a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

function getPages() {
    var links = document.querySelectorAll('#mw-pages ul li a');
    console.log('page links', links);
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start('https://en.wikipedia.org/wiki/Category:Border_crossings_of_Germany', function() {

    categories = this.evaluate(getCategories);

});

casper.then(function () {
    console.log("\n", 'categories #:', categories.length);
    casper.each(categories, function(self, link) {
        console.log('category: ', link);

        self.thenOpen(link, function() {
            var pages = this.evaluate(getPages);
            // pages = pages.concat(this.evaluate(getPages));
            console.log('pages', pages);
        });
    });
});


    // aggregate results

casper.run(function() {

    // echo results
    this.echo(links.length + ' borders found:');
    // this.echo(' - ' + links.join('\n - '))

    this.echo(pages.length + ' border crossings found:');

    this.exit();
});