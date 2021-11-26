"use strict";

const grammar  = require('../grammar');
const log      = require('../log');
const test     = require('../test');

const util     = require('util');

let findFunctions = {

    tokensUsingRegex(text$String, regex$RegExp, nameOfPattern$String)
    {
        let tokensFound$ArrayDictionary = [];
        let result$String;

        let result$ArrayObjects;
        while(result$ArrayObjects = regex$RegExp.exec(text$String))
        {
            tokensFound$ArrayDictionary.push
            (
                {
                    [grammar.constants.database.token_string_variable]    : result$ArrayObjects[0],
                    [grammar.constants.database.string_position_variable] : result$ArrayObjects.index,
                    [grammar.constants.database.part_of_speech_variable]  : nameOfPattern$String
                }
            );
        }

        return tokensFound$ArrayDictionary;
    },

    allOccurrencesOfString(text$String, textToSearchFor$String, tokensOnly$Boolean = false, caseSensitive$Boolean = false)
    {
        let indexes$ArrayInteger = [];
        if (test.value.notEmpty$String(text$String) && test.value.notEmpty$String(textToSearchFor$String))
        {
            let lengthText$Integer = textToSearchFor$String.length;
            if (lengthText$Integer === 0) return [];
            let startIndex$Integer = 0;
            let index$Integer;
            if (!caseSensitive$Boolean)
            {
                textToSearchFor$String = textToSearchFor$String.toLowerCase();
                text$String = text$String.toLowerCase();
            }

            while ((index$Integer = text$String.indexOf(textToSearchFor$String, startIndex$Integer)) > -1)
            {
                indexes$ArrayInteger.push(index$Integer);
                startIndex$Integer = index$Integer + lengthText$Integer;
            }
        }
        return indexes$ArrayInteger;
    },

    tokenPositionsWithinString(text$String, valueToCheckFor$String, caseSensitive$Boolean = false, separator$Character = ' ')
    {
        log.function.write("Checking the position of a token within another string", log.constants.debug);
        if(test.value.empty$String(text$String))
        {
            log.comment.write("Original text is empty. Returning null ", log.constants.debug);
            return null;
        }

        if(test.value.empty$String(valueToCheckFor$String))
        {
            log.comment.write("Value to check for is empty. Returning 0 ", log.constants.debug);
            return 0;
        }

        if(!caseSensitive$Boolean)
        {
            text$String = text$String.toUpperCase();
            valueToCheckFor$String = valueToCheckFor$String.toUpperCase();

            log.comment.write("Comparison has been set to not case sensitive. Comparing: ", log.constants.debug);
            log.comment.write("Text: " + util.inspect(text$String) + "\nValue to check for: " + util.inspect(valueToCheckFor$String), log.constants.debug);
        }

        let stringLocations$ArrayInteger =
            this.allOccurrencesOfString(text$String, valueToCheckFor$String);

        log.comment.write("All occurrences of valueToCheckFor$String '" + valueToCheckFor$String + "':", log.constants.debug);
        log.comment.write(util.inspect(stringLocations$ArrayInteger), log.constants.debug);

        let result$ArrayInteger = [];

        if(test.value.notEmpty$Array(stringLocations$ArrayInteger))
        {
            for(let stringLocation$Integer of stringLocations$ArrayInteger)
            {
                log.comment.write("Now checking position " + stringLocation$Integer, log.constants.debug);

                let hasToken$Boolean = test.value.hasTokenAtPosition$String
                (
                    text$String,
                    valueToCheckFor$String,
                    stringLocation$Integer,
                    caseSensitive$Boolean
                );
                if(hasToken$Boolean)
                {
                    result$ArrayInteger.push(stringLocation$Integer);

                    log.comment.write("Adding stringLocation$Integer " + stringLocation$Integer + " to result$ArrayInteger", log.constants.debug);
                    log.comment.write(util.inspect(result$ArrayInteger), log.constants.debug);
                }
            }
        }

        log.comment.write("Returning result$ArrayInteger from tokenPositionsWithinString", log.constants.debug);
        log.comment.write(util.inspect(result$ArrayInteger), log.constants.debug);

        return result$ArrayInteger;
    },

};

module.exports = findFunctions;