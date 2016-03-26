// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

// based on https://blog.tompawlak.org/number-currency-formatting-javascript
Number.prototype.formatNumber = function () {
    var num = this;
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
String.prototype.formatNumber = function () {
    var numstring = this;
    return numstring.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

var load_csv = function (url, querytype) {
    if (querytype === undefined) {
        querytype = "text";
    }
    return $.ajax({
        url: url,
        dataType: querytype
    })
        .fail(function (msg) {
            console.error(msg);
        });
};

var get_happiness = function (countryname, happiness) {
    var score = 'unknown';
    for (var i = 0, s = happiness.length; i < s; i++) {
        if (happiness[i].Country === countryname) {
            score = happiness[i].Score;
            break;
        }
    }
    if (!(score >= 0)) {
        score = 'unknown';
    }
    return score;
};

var get_property = function (countryname, obj, key) {
    var score = 'unknown';

    // debug to improve data quality
    if (obj[countryname] === undefined) {
        console.debug(key+':', countryname + ' not found');
        return score;
    }
    // debug to improve data quality
    if (obj[countryname][key] === undefined) {
        console.debug(key+':', key + ' not found');
        return score;
    }

    //if (
    //    obj[countryname] !== undefined
    //    && obj[countryname][key] !== undefined
    //) {
    score = obj[countryname][key];
    //}
    return score;
};

var get_properties = function (countryname, obj, keyarr) {
    var results = [];

    // debug to improve data quality
    if (obj[countryname] === undefined) {
        console.debug(keyarr.join(',')+':', countryname + ' not found');
        return results;
    }

    for (var i = 0, s = keyarr.length; i < s; i++) {
        // debug to improve data quality
        if (obj[countryname][keyarr[i]] === undefined) {
            console.debug(keyarr.join(',')+':', keyarr[i] + ' not found');
            return results;
        }
        results.push(obj[countryname][keyarr[i]]);
    }

    return results;
};

// -------------------------------------------------------------