import scrapy

import logging


class BorderCrossingsSpider(scrapy.Spider):
    name = 'bordercrossings'

    bcs = {}

    # start_urls = ['https://en.wikipedia.org/wiki/Category:International_border_crossings']

    start_urls = ['https://en.wikipedia.org/wiki/Category:Border_crossings_of_Germany']

    #def parse(self, response):
    #    for href in response.css('#mw-subcategories ul li a::attr(href)'):
    #        country_url = response.urljoin(href.extract())
    #        yield scrapy.Request(country_url, callback=self.parse_country)

    # now on country-level

    def parse(self, response):
    	countryname = response.css('#firstHeading::text').extract()[0].replace('Category:Border crossings of ', '')
	# logging.info("Scraping %s" % countryname)
        for href in response.css('#mw-subcategories ul li a::attr(href)'):
            request = scrapy.Request(response.urljoin(href.extract()), callback=self.parse_countryborder)
            request.meta['country'] = countryname
            yield request


    #def parse_country(self, response):
    #    for href in response.css('#mw-subcategories ul li a::attr(href)'):
    #        country_border_url = response.urljoin(href.extract())
    #        yield scrapy.Request(country_border_url, callback=self.parse_countryborder)

    # now on country-border-level

    def parse_countryborder(self, response):
        for href in response.css('#mw-pages ul li a::attr(href)'):
            request = scrapy.Request(response.urljoin(href.extract()), callback=self.parse_bordercrossing)
            request.meta['country'] = response.meta['country']
            yield request

    # now on bordercrossing page

    def parse_bordercrossing(self, response):

    	bcname = response.css('#firstHeading::text').extract()[0]
	# logging.info("Scraping %s" % bcname)

        geo_url = response.css('#coordinates a.external::attr(href)').extract()[0]
        if geo_url.startswith('//'):
            geo_url = 'http:' + geo_url

        request = scrapy.Request(geo_url, callback=self.parse_geo)

        # carry all the stuff along to the final level
        request.meta['country'] = response.meta['country']
        request.meta['name'] = bcname
        request.meta['link'] = response.url

        yield request
        

    # now on geo page

    def parse_geo(self, response):

    	lat = response.css('.geo .latitude::text').extract()[0]
    	lng = response.css('.geo .longitude::text').extract()[0]

        yield {
            'name':    response.meta['name'],
            'link':    response.meta['link'],
            'country': response.meta['country'],
            'lat': lat,
            'lng': lng,
        }