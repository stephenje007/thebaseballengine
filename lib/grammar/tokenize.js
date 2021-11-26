"use strict";

const database  = require('../database');
const log       = require('../log');
const grammar  = require('./');
const test      = require('../test');
const text      = require('../text');
const value     = require('../value');

let readFunctions = {

    async text(text$String, databaseName$String, request$ExpressRequestDictionary = null)
    {
        log.function.write("Reading text to convert to SQL", log.constants.debug);
        log.value.write("databaseName$String", databaseName$String, log.constants.debug);

        let tokens$ArrayDictionary = [];

        if(test.assertion.notEmpty$String(text$String))
        {
            text$String = text.remove.extraSpaces(text$String);

            // let tokensFromMasterDatabase$ArrayDictionary = await grammar.query.tokens(text$String, database.constants.master.database_name, request$ExpressRequestDictionary);
            // log.value.write("tokensFromMasterDatabase$ArrayDictionary: retrieved token matches from master database", tokensFromMasterDatabase$ArrayDictionary, log.constants.debug);
            //
            // let tokensFromUserDatabase$ArrayDictionary = await grammar.query.tokens(text$String, databaseName$String, request$ExpressRequestDictionary);
            // log.value.write("tokensFromUserDatabase$ArrayDictionary: retrieved token matches from user database and concatenated", tokensFromUserDatabase$ArrayDictionary, log.constants.debug);
            //
            // let tokensFoundInMasterDatabase$Boolean = test.value.notEmpty$Array(tokensFromMasterDatabase$ArrayDictionary);
            // let tokensFoundInUserDatabase$Boolean = test.value.notEmpty$Array(tokensFromUserDatabase$ArrayDictionary);

            tokens$ArrayDictionary = await grammar.query.tokensFromMasterAndUserDatabases(text$String, databaseName$String, request$ExpressRequestDictionary);
            if (test.value.empty$Array(tokens$ArrayDictionary))
            {
                log.function.return("No tokens found. Returning null from grammar.read.text", null, log.constants.debug);
                return;
            }

            // log.comment.write("Assigning value to tokens$ArrayDictionary based on whether tokens have been found", log.constants.debug);
            //
            // if (tokensFoundInMasterDatabase$Boolean && tokensFoundInUserDatabase$Boolean)
            //     tokens$ArrayDictionary = tokensFromMasterDatabase$ArrayDictionary.concat(tokensFromUserDatabase$ArrayDictionary);
            // else if (tokensFoundInMasterDatabase$Boolean && !tokensFoundInUserDatabase$Boolean)
            //     tokens$ArrayDictionary = tokensFromMasterDatabase$ArrayDictionary;
            // else if (!tokensFoundInMasterDatabase$Boolean && tokensFoundInUserDatabase$Boolean)
            //     tokens$ArrayDictionary = tokensFromUserDatabase$ArrayDictionary;
            // else
            // {
            //     log.function.return("No tokens found. Returning null from grammar.read.text", null, log.constants.debug);
            //     return;
            // }

            log.value.write("Combined token array", tokens$ArrayDictionary, log.constants.debug);
        }
        else
        {
            log.comment.write("String is empty", log.constants.debug);
        }

        log.function.return("Returning tokens$ArrayDictionary from grammar.read.text", tokens$ArrayDictionary, log.constants.debug);
        return tokens$ArrayDictionary;
    },

    numbers(text$String)
    {
        let tokensFound$ArrayDictionary = [];

        tokensFound$ArrayDictionary = text.find.tokensUsingRegex
        (
            text$String,
            grammar.constants.partsOfSpeech.noun_math_date.regex,
            grammar.constants.partsOfSpeech.noun_math_date.name
        );

        tokensFound$ArrayDictionary = tokensFound$ArrayDictionary.concat(
            text.find.tokensUsingRegex
            (
                text$String,
                grammar.constants.partsOfSpeech.noun_math_number.regex,
                grammar.constants.partsOfSpeech.noun_math_number.name,
            )
        );

        log.function.return("Returning tokens$ArrayDictionary from grammar.read.numbers", tokensFound$ArrayDictionary, log.constants.debug);
        return tokensFound$ArrayDictionary;
    },

    async names(text$String, databaseName$String, tokens$ArrayDictionary)
    {
        log.function.write("Get names and proper nouns", log.constants.debug);
        log.comment.write("Original string: '" + text$String + "'", log.constants.debug);
        log.value.write("Original array of tokens", tokens$ArrayDictionary, log.constants.debug);

        let result$ArrayDictionary = [];

        let tokenSubstitutionLookups$ArrayDictionary =
            await grammar.query.databaseLocationsForNames(databaseName$String);

        log.comment.write("Database information to be used to lookup unrecognized items: " + databaseName$String, log.constants.debug);
        log.value.write("tokenSubstitutionLookups$ArrayDictionary", tokenSubstitutionLookups$ArrayDictionary, log.constants.debug);

        for(let i = 0; i < tokenSubstitutionLookups$ArrayDictionary.length; i++)
        {
            let partOfSpeech$String = '';
            if(test.value.notEmpty$Array(tokenSubstitutionLookups$ArrayDictionary))
                partOfSpeech$String = tokenSubstitutionLookups$ArrayDictionary[i][grammar.constants.database.part_of_speech_variable];

            log.value.write("partOfSpeech$String: part of speech from tokenSubstitutionLookups$ArrayDictionary[" + i + "]", partOfSpeech$String, log.constants.debug);

            let jsonDefinition$StringToJsonParse = '';
            if(test.value.notEmpty$Array(tokenSubstitutionLookups$ArrayDictionary))
                jsonDefinition$StringToJsonParse = tokenSubstitutionLookups$ArrayDictionary[i][grammar.constants.database.json_definition_variable];

            let tokenSubstitutionLookup$String =
                tokenSubstitutionLookups$ArrayDictionary[i][grammar.constants.database.json_definition_variable];
            log.value.write("tokenSubstitutionLookup$String: get database definition string from array", tokenSubstitutionLookup$String, log.constants.debug);

            let tokenSubstitutionLookup$Dictionary = {};
            if(test.value.notEmpty$String(tokenSubstitutionLookup$String))
                tokenSubstitutionLookup$Dictionary = JSON.parse(tokenSubstitutionLookup$String);

            log.comment.write("Parse database definition string as JSON: tokenSubstitutionLookup$Dictionary", log.constants.debug);
            log.value.write("Can contain foreignKeys$ArrayDictionary and databaseLocations$ArrayDictionary", tokenSubstitutionLookup$Dictionary, log.constants.debug);

            let tokenDatabaseLookup$ArrayDictionary =
                tokenSubstitutionLookup$Dictionary[grammar.constants.database.database_locations_variable];
            log.comment.write("tokenDatabaseLookup$ArrayDictionary: database location from definition", tokenDatabaseLookup$ArrayDictionary, log.constants.debug);

            if(test.value.notEmpty$Array(tokenDatabaseLookup$ArrayDictionary))
            {
                log.value.write("Database location used for query: " + databaseName$String, tokenDatabaseLookup$ArrayDictionary, log.constants.debug);

                let nextResult$ArrayDictionary = await grammar.query.namesUsingDatabaseLocations
                (
                    text$String,
                    databaseName$String,
                    tokenDatabaseLookup$ArrayDictionary,
                    partOfSpeech$String,
                    jsonDefinition$StringToJsonParse
                );

                result$ArrayDictionary = result$ArrayDictionary.concat(nextResult$ArrayDictionary);
            }
        }

        log.function.return("Returning result$ArrayDictionary including names from grammar.read.names", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    }

};

module.exports = readFunctions;
