"use strict";

const grammar   = require('.');
const log       = require('../log');
const test      = require('../test');
const text      = require('../text');
const value     = require('../value');

let responseFunctions = { // as grammar.respond.to

    async text(text$String, databaseName$String, request$ExpressRequestDictionary = null)
    {
        log.function.write("Answer the question asked in the string", log.constants.debug);
        log.value.write("text$String", text$String, log.constants.debug);

        text$String = text.remove.extraSpaces(text$String);
        text$String = text.remove.backslashes(text$String);

        if (!test.assertion.notEmpty$String(text$String))
        {
            log.function.return("text$String is empty. Returning from grammar.answer.text", text$String, log.constants.debug);
            return;
        }

        let tokens$ArrayDictionary = [];
        tokens$ArrayDictionary = await grammar.tokenize.text(text$String, databaseName$String, request$ExpressRequestDictionary);
        log.value.write("tokens$ArrayDictionary: read tokens from database", tokens$ArrayDictionary, log.constants.debug);

        if (test.value.notEmpty$Array(tokens$ArrayDictionary))
        {
            tokens$ArrayDictionary = tokens$ArrayDictionary.concat(grammar.tokenize.numbers(text$String));
            log.value.write("tokens$ArrayDictionary: parsed numbers from text", tokens$ArrayDictionary, log.constants.debug);

            log.comment.write("Preparing to sort and remove any duplicates", log.constants.debug);

            tokens$ArrayDictionary = value.sort.ArrayDictionary(tokens$ArrayDictionary, grammar.constants.database.string_position_variable);
            log.value.write("tokens$ArrayDictionary: sorted by " + grammar.constants.database.string_position_variable, tokens$ArrayDictionary, log.constants.debug);

            tokens$ArrayDictionary = grammar.tokens.removeOverlappingTokens(text$String, tokens$ArrayDictionary);
            log.value.write("tokens$ArrayDictionary: removed overlapping tokens 1", tokens$ArrayDictionary, log.constants.debug);

            tokens$ArrayDictionary = grammar.tokens.addTokensForStringsThatOccurMoreThanOnce(text$String, tokens$ArrayDictionary);
            log.value.write("tokens$ArrayDictionary: added back tokens that occur in the original string more than once", tokens$ArrayDictionary, log.constants.debug);

            log.comment.write("Preparing to sort and remove any duplicates added by addTokensForStringsThatOccurMoreThanOnce", log.constants.debug);

            tokens$ArrayDictionary = value.sort.ArrayDictionary(tokens$ArrayDictionary, grammar.constants.database.string_position_variable);
            log.value.write("tokens$ArrayDictionary: sorted by " + grammar.constants.database.string_position_variable, tokens$ArrayDictionary, log.constants.debug);

            tokens$ArrayDictionary = grammar.tokens.removeOverlappingTokens(text$String, tokens$ArrayDictionary);
            log.value.write("tokens$ArrayDictionary: removed overlapping tokens 2", tokens$ArrayDictionary, log.constants.debug);

            log.comment.write("Preparing to look up any proper names", log.constants.debug);

            tokens$ArrayDictionary = tokens$ArrayDictionary.concat(await grammar.tokenize.names(text$String, databaseName$String, tokens$ArrayDictionary));
            log.value.write("tokens$ArrayDictionary: retrieved names", tokens$ArrayDictionary, log.constants.debug);

            tokens$ArrayDictionary = value.sort.ArrayDictionary(tokens$ArrayDictionary, grammar.constants.database.string_position_variable);
            log.value.write("tokens$ArrayDictionary: sorted by " + grammar.constants.database.string_position_variable, tokens$ArrayDictionary, log.constants.debug);

            log.comment.write("Parse into phrases, preparing to generate SQL", log.constants.debug);

            let interrogatives$ArrayArrayDictionary = grammar.parse.interrogatives(tokens$ArrayDictionary);
            log.value.write("interrogatives$ArrayArrayDictionary", interrogatives$ArrayArrayDictionary, log.constants.debug);

            let comparisons$ArrayArrayDictionary = grammar.parse.comparisons(tokens$ArrayDictionary);
            log.value.write("comparisons$ArrayArrayDictionary", comparisons$ArrayArrayDictionary, log.constants.debug);

            let prepositionals$ArrayArrayDictionary = grammar.parse.prepositionals(tokens$ArrayDictionary);
            log.value.write("prepositionals$ArrayArrayDictionary", prepositionals$ArrayArrayDictionary, log.constants.debug);

            // If there is already a comparison, numbers in a prepositional usually represent dates

            let sql$String = grammar.sql.analyzePhrases
            (
                interrogatives$ArrayArrayDictionary,
                comparisons$ArrayArrayDictionary,
                prepositionals$ArrayArrayDictionary,
            );

            //sql$String = "USE `" + databaseName$String + "`; " + sql$String;
            return await global.pool$DatabaseConnectionPool.runScriptWithoutSubstitutions(databaseName$String, sql$String);
        }
        else
        {
            return null;
        }
    },

    JSON(json$String)
    {

    },

    SQL(sql$String)
    {

    }

};

module.exports.to = responseFunctions;