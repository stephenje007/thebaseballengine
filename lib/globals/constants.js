"use strict";

const global = require('.');

let vocabulary = {
        english     : "english",
        french      : "french",
        italian     : "italian",
        spanish     : "spanish",
};

module.exports.vocabulary = vocabulary;


let language = {
        default: this.vocabulary.english
};

module.exports.language = language;