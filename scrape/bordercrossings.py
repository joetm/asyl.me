import scrapy


class BorderCrossingsSpider(scrapy.Spider):
    name = 'bordercrossings'

    # start_urls = ['https://en.wikipedia.org/wiki/Category:International_border_crossings']

    start_urls = ['https://en.wikipedia.org/wiki/Category:Border_crossings_of_Germany']


    #def parse(self, response):
    #    for href in response.css('#mw-subcategories ul li a::attr(href)'):
    #        country_url = response.urljoin(href.extract())
    #        yield scrapy.Request(country_url, callback=self.parse_country)

    # now on country-level

    def parse(self, response):
        for href in response.css('#mw-subcategories ul li a::attr(href)'):
            yield scrapy.Request(response.urljoin(href.extract()), callback=self.parse_countryborder)


    #def parse_country(self, response):
    #    for href in response.css('#mw-subcategories ul li a::attr(href)'):
    #        country_border_url = response.urljoin(href.extract())
    #        yield scrapy.Request(country_border_url, callback=self.parse_countryborder)

    # now on country-border-level

    def parse_countryborder(self, response):
        for href in response.css('#mw-pages ul li a::attr(href)'):
            yield scrapy.Request(response.urljoin(href.extract()), callback=self.parse_bordercrossing)

    # now on bordercrossing page

    def parse_bordercrossing(self, response):
        # border crossing
        yield {
            'name': response.css('#firstHeading::text').extract()[0],
            'link': response.url,
        }
        
        #for href in response.css('#coordinates a.external::attr(href)'):
        #    yield scrapy.Request(response.urljoin(href.extract()), callback=self.parse_geo)

    # now on geo page

    def parse_geo(self, response):
        yield {
            'lat': 'TODO',
            'lng': 'TODO',
        }