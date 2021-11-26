"use strict";

module.exports.language = require('./language');
module.exports.localization = require('./localization');
module.exports.constants = require('./constants');

module.exports.text = this.localization.language; // function call
