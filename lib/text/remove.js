"use strict";

const test = require('../test');

let removalFunctions = {

    extraSpaces(text$String)
    {
        if(test.value.notEmpty$String(text$String))
        {
            text$String = text$String.trim();
            text$String = text$String.replace(/\s\s+/g, ' ');
        }
        return text$String;
    },

    backslashes(text$String)
    {
        let result$String = '';

        if (test.value.notEmpty$String(text$String))
        {
            result$String = text$String.replace(/\\/g, '');
        }

        return result$String;
    }


};

module.exports = removalFunctions;