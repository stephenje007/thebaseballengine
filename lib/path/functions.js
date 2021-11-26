"use strict";

const path = require('../path');
const test = require('../test');

module.exports.url = function(request$ExpressRequestDictionary)
{
    let result$String = '';
    if (test.assertion.notEmpty$Dictionary(request$ExpressRequestDictionary))
        result$String = request$ExpressRequestDictionary.protocol + '://' + request$ExpressRequestDictionary.get('host') + request$ExpressRequestDictionary.originalUrl;

    return result$String;
};

module.exports.base = function(request$ExpressRequestDictionary)
{
    let result$String = '';
    if (test.assertion.notEmpty$Dictionary(request$ExpressRequestDictionary))
        result$String = request$ExpressRequestDictionary.protocol + '://' + request$ExpressRequestDictionary.get('host');

    return result$String;
};

module.exports.dashboard = function(request$ExpressRequestDictionary, accountName$String)
{
    let result$String = '';
    if (test.assertion.notEmpty$Dictionary(request$ExpressRequestDictionary))
        result$String = this.base(request$ExpressRequestDictionary) + path.constants.route.dashboard + '/' + accountName$String;

    return result$String;
};