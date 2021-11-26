"use strict";

const grammar   = require('../grammar');
const log       = require('../log');
const test      = require('../test');

let extractionFunctions = {

    // Functions that pull a specific value from a data type

    keyFromKeyValuePair(value$KeyValuePair)
    {
        let result$String = null;

        if (test.assertion.is$KeyValuePair(value$KeyValuePair))
        {
            result$String = Object.keys(value$KeyValuePair)[0];
        }

        return result$String;
    },

    valueFromKeyValuePair(value$KeyValuePair)
    {
        let result$Object = null;

        if (test.assertion.is$KeyValuePair(value$KeyValuePair))
        {
            result$Object = Object.values(value$KeyValuePair)[0];
        }

        return result$Object;
    },

    valueFromDictionary(values$Dictionary, key$String, defaultValue$Object = null)
    {
        return (test.value.hasKey(values$Dictionary, key$String))
            ? values$Dictionary[key$String]
            : defaultValue$Object;
    },

    matchingRecordsFromArrayDictionary(list$ArrayDictionary, key$String, value$String)
    {
        log.function.write("Checking dictionary list for a key and value", log.constants.debug);
        log.value.write("List of dictionaries to check as list$ArrayDictionary", list$ArrayDictionary, log.constants.debug);

        let result$ArrayDictionary = [];

        if (test.assertion.notEmpty$Array(list$ArrayDictionary))
        {
            for (let i = 0; i < list$ArrayDictionary.length; i++)
            {
                log.value.write("Current dictionary list$ArrayDictionary[" + i + "]", list$ArrayDictionary[i], log.constants.debug);

                let currentValue$String = list$ArrayDictionary[i][key$String];
                log.value.write("Current value from list$ArrayDictionary[" + i + "]", currentValue$String, log.constants.debug);
                log.value.write("Checking against value$String", value$String, log.constants.debug);

                if (test.value.equal$String(currentValue$String, value$String))
                {
                    result$ArrayDictionary.push(list$ArrayDictionary[i]);
                    log.value.write("Added matching record as result$ArrayDictionary", result$ArrayDictionary, log.constants.debug);
                }
            }
        }

        log.function.return("Returning result$ArrayDictionary from matchingRecordsFromArrayDictionary", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

    JSONDefinitionFromToken(token$Dictionary)
    {
        log.function.write("Extract JSON definition from token", log.constants.debug);

        let result$Dictionary = {};
        if (test.value.notEmpty$Dictionary(token$Dictionary))
        {
            let json$String = token$Dictionary[grammar.constants.database.json_definition_variable];
            log.value.write("JSON string from token as json$String", json$String, log.constants.debug);

            if (test.value.notEmpty$String(json$String))
            {
                result$Dictionary = JSON.parse(json$String);
                log.value.write("Parsed JSON definition", result$Dictionary, log.constants.debug);
            }
        }

        log.function.return("Returning result$Dictionary from JSONDefinitionFromToken", result$Dictionary, log.constants.debug);
        return result$Dictionary;
    },

    columnNamesFromJSONArrayDictionary(json$ArrayDictionary, replacePlaceholderForSpaces$Booleans = false)
    {
        let columnNames$ArrayString = json$ArrayDictionary.reduce(function(keys, element)
        {
            for (let key in element)
            {
                if(!keys.includes(key))
                {
                    keys.push(key);
                }
            }
            return keys;
        }, []);

        return columnNames$ArrayString;
    },

};

module.exports = extractionFunctions;