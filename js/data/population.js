/**
 * Data
 * @module
 */

/*global define*/


define(['jquery', 'data', 'helpers', 'papaparse'], function ($, data, helpers, Papa) {
    'use strict';

    var $population = data.register('population');

    // -------------------------------------------------------------
    // AJAX query
    // -------------------------------------------------------------

    // World population
    // https://docs.google.com/spreadsheets/d/1-lhti1yTM5CjlMTz3Hc_VqEnVTxbhoIS8WjUetmIWHs/pub?output=csv
    var $population_query = helpers.load_csv("data/population/population.csv");

    // -------------------------------------------------------------
    // DATA processing
    // -------------------------------------------------------------

    $.when($population_query).done(function (population_data) {
        if (!population_data) {
            $population.reject('Could not load population data');
            return;
        }
        population_data = Papa.parse(population_data, {
                            delimiter: ",",
                            newline: "",
                            header: true,
                            dynamicTyping: true
                        });
        population_data = population_data.data;
        // console.log('population_data', population_data);

        var population = {};
        for (var i = 0, s = population_data.length; i < s; i++) {
            // fix the nasty country key
            for(var key in population_data[i]) {
                if(
                    population_data[i].hasOwnProperty(key) &&
                    typeof population_data[i][key] === 'string'
                ) {
                    population_data[i][key] = population_data[i][key]
                                                .replace(/\s*\[Note\s\d+\]/g, '')
                                                .replace(/\s*\*\([a-z,\.\-\s]+\)\*/gi, '')
                                                .replace(/[\*\"]/g, '');
                    // fix population figure
                    if (key === 'Population') {
                        population_data[i][key] = parseInt(population_data[i][key].replace(/,/g, ''), 10);
                    }
                }
            }
            population[population_data[i]['Country (or dependent territory)']] = population_data[i];
        }
        console.log('population', population);

        data.resolve('population', population);


// TODO
                // population
                // feature.properties.population = get_property(feature.properties.name, population, 'Population');








    });

    return $population;

});

// -------------------------------------------------------------

