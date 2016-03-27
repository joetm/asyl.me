/**
 * Data
 * @module
 */

/*global define*/

define(['jquery', 'domReady', 'helpers', 'papaparse'], function ($, domReady, helpers, Papa) {
    'use strict';

    var self = {};

    self.data = {};

    self.all = $.Deferred();

    self.register = function (datakey) {
        self.data[datakey] = $.Deferred();
        return self.data[datakey];
    };

    self.resolve = function (datakey, obj) {
        self.data[datakey].resolve(obj);
    };

    self.reject = function (datakey, obj) {
        self.data[datakey].reject('Could not load '+datakey+' data');
    };

    self.allresolved = function () {
        var keys = Object.keys(self.data);
        var is_all_resolved = true;
        for (var i = 0, s = keys.length; i < s; i++) {
            if (!self.data[keys[i]].isResolved()) {
                is_all_resolved = false;
                break;
            }
        }
        if (is_all_resolved) {
            self.all.resolve(self.data);
        }
        return self.all;
    };

    return self;

});

// -------------------------------------------------------------

