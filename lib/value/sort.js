"use strict";

const test = require('../test');

let sortFunctions = {

    ArrayDictionary(arrayDictionary$ArrayDictionary, key$String)
    {
        let result$ArrayDictionary = {};
        if (test.value.notEmpty$Array(arrayDictionary$ArrayDictionary))
        {
            if (test.assertion.notEmpty$String(key$String))
            {
                result$ArrayDictionary = arrayDictionary$ArrayDictionary.sort
                (
                    function(value1$Dictionary, value2$Dictionary)
                    {
                        let comparison$Integer = 0;
                        comparison$Integer = (value1$Dictionary[key$String] > value2$Dictionary[key$String])
                            ? 1
                            : -1;

                        return comparison$Integer;
                    }
                );
            }

        }

        return result$ArrayDictionary;
    }

};

module.exports = sortFunctions;