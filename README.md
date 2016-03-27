ASYL.ME
========


Installation
------------

`npm install`

`pip install ./scrape/requirements.txt`


Scraping
--------

`scrapy runspider ./scrape/bordercrossings.py -o ./data/bordercrossings/bordercrossings.geojson`


Extending with data
-------------------

1.  Copy one of the files in the `js/data` folder and update it
2.  Add the filename to the data_plugins array in `js/loader.js`
3.  Copy one of the files in the `js/layers` folder and update it

