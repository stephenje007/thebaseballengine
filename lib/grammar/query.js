"use strict";

const log        = require('../log');
const database   = require('../database');
const globals    = require('../globals');
const grammar    = require('.');
const test       = require('../test');
const value      = require('../value');

let queryFunctions = { // as grammar.query

    async tokens(text$String, databaseName$String, request$ExpressRequestDictionary = null, tokensTable$String = grammar.constants.database.tokens_table)
    {
        log.function.write("Match text in string to tokens in database", log.constants.debug);

        let sql$String = '';
        //sql$String += "USE `" + databaseName$String + "`; ";
        sql$String += 'SELECT ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += 'INSTR(?, ??) AS ? ';
        sql$String += 'FROM ?? ';
        sql$String += 'WHERE INSTR(?, ??) != 0; ';

        let result$ArrayDictionary = await global.pool$DatabaseConnectionPool.runScript
        (
            databaseName$String,
            sql$String,
            [
                grammar.constants.database.token_lookup_column, grammar.constants.database.token_string_variable,
                grammar.constants.database.part_of_speech_lookup_column, grammar.constants.database.part_of_speech_variable,
                grammar.constants.database.json_definition_lookup_column, grammar.constants.database.json_definition_variable,
                grammar.constants.database.language_lookup_column, grammar.constants.database.language_variable,
                text$String, grammar.constants.database.token_lookup_column, grammar.constants.database.string_position_variable,

                grammar.constants.database.tokens_table,
                text$String, grammar.constants.database.token_lookup_column
            ]
        );

        log.comment.write("Set session language to language value returned most from database", log.constants.debug);
        log.comment.write("Allow mixing languages", log.constants.debug);
        log.value.write("request$ExpressRequestDictionary: Ensure request object is set correctly", request$ExpressRequestDictionary, log.constants.debug);
        if (test.assertion.notEmpty$Array(result$ArrayDictionary) && test.value.notEmpty$Dictionary(request$ExpressRequestDictionary))
        {
            let mostReturnedLanguage$String = value.crossfilter.occursMostOftenInArrayDictionary(result$ArrayDictionary, grammar.constants.database.language_variable);
            globals.language.set(request$ExpressRequestDictionary, mostReturnedLanguage$String);
            log.value.write("Side effect: mostReturnedLanguage$String: set session language based on values returned in result$ArrayDictionary", mostReturnedLanguage$String, log.constants.debug);
        }

        log.function.return("Returning tokens from database as result$ArrayDictionary from grammar.index.database.lookup.tokens", result$ArrayDictionary, log.constants.debug);

        return result$ArrayDictionary;

    },

    async tokensFromMasterAndUserDatabases(text$String, databaseName$String, request$ExpressRequestDictionary = null, tokensTable$String = grammar.constants.database.tokens_table)
    {
        log.function.write("Match text in string to tokens in database", log.constants.debug);
        log.value.write("databaseName$String", databaseName$String, log.constants.debug);

        let sql$String = '';
        //sql$String += "USE `" + databaseName$String + "`; ";
        sql$String += 'SELECT ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += 'INSTR(?, ??) AS ? ';
        sql$String += 'FROM ?? ';
        sql$String += 'WHERE INSTR(?, ??) != 0; ';

        let result$ArrayDictionary = [];

        let result1$ArrayDictionary = await global.pool$DatabaseConnectionPool.runScript
        (
            databaseName$String,
            sql$String,
            [
                grammar.constants.database.token_lookup_column, grammar.constants.database.token_string_variable,
                grammar.constants.database.part_of_speech_lookup_column, grammar.constants.database.part_of_speech_variable,
                grammar.constants.database.json_definition_lookup_column, grammar.constants.database.json_definition_variable,
                grammar.constants.database.language_lookup_column, grammar.constants.database.language_variable,
                text$String, grammar.constants.database.token_lookup_column, grammar.constants.database.string_position_variable,

                grammar.constants.database.tokens_table,
                text$String, grammar.constants.database.token_lookup_column
            ]
        );
        log.value.write("result1$ArrayDictionary", result1$ArrayDictionary, log.constants.debug);

        sql$String = '';
        //sql$String += "USE `" + database.constants.master.database_name + "`; ";
        sql$String += 'SELECT ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += 'INSTR(?, ??) AS ? ';
        sql$String += 'FROM ?? ';
        sql$String += 'WHERE INSTR(?, ??) != 0; ';

        let result2$ArrayDictionary = await global.pool$DatabaseConnectionPool.runScript
        (
            database.constants.master.database_name,
            sql$String,
            [
                grammar.constants.database.token_lookup_column, grammar.constants.database.token_string_variable,
                grammar.constants.database.part_of_speech_lookup_column, grammar.constants.database.part_of_speech_variable,
                grammar.constants.database.json_definition_lookup_column, grammar.constants.database.json_definition_variable,
                grammar.constants.database.language_lookup_column, grammar.constants.database.language_variable,
                text$String, grammar.constants.database.token_lookup_column, grammar.constants.database.string_position_variable,

                grammar.constants.database.tokens_table,
                text$String, grammar.constants.database.token_lookup_column
            ]
        );
        log.value.write("result2$ArrayDictionary", result2$ArrayDictionary, log.constants.debug);

        if (test.value.notEmpty$Array(result1$ArrayDictionary))
            result$ArrayDictionary = result1$ArrayDictionary.concat(result2$ArrayDictionary);
        else
            result$ArrayDictionary = result2$ArrayDictionary;
        log.value.write("result$ArrayDictionary", result$ArrayDictionary, log.constants.debug);

        log.comment.write("Set session language to language value returned most from database", log.constants.debug);
        log.comment.write("Allow mixing languages", log.constants.debug);
        log.value.write("request$ExpressRequestDictionary: Ensure request object is set correctly", request$ExpressRequestDictionary, log.constants.debug);
        if (test.assertion.notEmpty$Array(result$ArrayDictionary) && test.value.notEmpty$Dictionary(request$ExpressRequestDictionary))
        {
            let mostReturnedLanguage$String = value.crossfilter.occursMostOftenInArrayDictionary(result$ArrayDictionary, grammar.constants.database.language_variable);
            globals.language.set(request$ExpressRequestDictionary, mostReturnedLanguage$String);
            log.value.write("Side effect: mostReturnedLanguage$String: set session language based on values returned in result$ArrayDictionary", mostReturnedLanguage$String, log.constants.debug);
        }

        log.function.return("Returning tokens from database as result$ArrayDictionary from grammar.index.database.lookup.tokens", result$ArrayDictionary, log.constants.debug);

        return result$ArrayDictionary;

    },


    async databaseLocationsForNames(databaseName$String)
    {
        log.function.write("Get location to lookup names and proper nouns from tokens table", log.constants.debug);

        let result$ArrayDictionary = [];

        let sql$String = '';
        //sql$String += 'USE `' + databaseName$String + "`;";
        sql$String += 'SELECT ?? AS ??, ';
        sql$String += '?? AS ??, ';
        sql$String += '?? AS ?? ';
        sql$String += 'FROM ?? WHERE ?? LIKE ?; ';
        result$ArrayDictionary = await global.pool$DatabaseConnectionPool.runScript
        (
            databaseName$String,
            sql$String,
            [
                grammar.constants.database.token_lookup_column, grammar.constants.database.token_string_variable,
                grammar.constants.database.part_of_speech_lookup_column, grammar.constants.database.part_of_speech_variable,
                grammar.constants.database.json_definition_lookup_column, grammar.constants.database.json_definition_variable,

                grammar.constants.database.tokens_table,
                grammar.constants.database.token_lookup_column,
                grammar.constants.database.lookup_variable_delineator + "%" + grammar.constants.database.lookup_variable_delineator
            ]
        );

        log.function.return("Returning result$ArrayDictionary from databaseLocationsForNames", result$ArrayDictionary, log.constants.debug);

        return result$ArrayDictionary;
    },

    async namesUsingDatabaseLocations
    (
        text$String,
        databaseName$String,
        databaseLocations$ArrayDictionary = [],
        partOfSpeech$String = '',
        jsonToAppend$String = ''
    )
    {

        log.function.write("Get proper nouns", log.constants.debug);

        log.value.write("Token table and column list: ", databaseLocations$ArrayDictionary, log.constants.debug);

        let result$ArrayDictionary = [];
        let tables$ArrayString = [];

        if(test.assertion.notEmpty$Array(databaseLocations$ArrayDictionary))
        {
            // Check what happens if there are multple people with the same concatenated name

            let sqlRequiredColumnOrConcatenation$String = '';

            if(test.value.numberOfItems$Array(databaseLocations$ArrayDictionary) === 1)
            {
                let databaseLocation$Dictionary = databaseLocations$ArrayDictionary[0];
                if
                (
                    test.assertion.hasKey(databaseLocation$Dictionary, 'tableName$String')
                    && test.assertion.hasKey(databaseLocation$Dictionary, 'columnName$String')
                )
                {
                    let tableName$String = databaseLocation$Dictionary['tableName$String'];
                    let columnName$String = databaseLocation$Dictionary['columnName$String'];

                    tables$ArrayString.push(tableName$String);
                    sqlRequiredColumnOrConcatenation$String += "`" + tableName$String + "`.`" + columnName$String + "`";
                }
            }
            else
            {
                sqlRequiredColumnOrConcatenation$String += "CONCAT(";
                for (let i = 0; i < databaseLocations$ArrayDictionary.length; i++)
                {
                    let databaseLocation$Dictionary = databaseLocations$ArrayDictionary[i];
                    if
                    (
                        test.assertion.hasKey(databaseLocation$Dictionary, 'tableName$String')
                        && test.assertion.hasKey(databaseLocation$Dictionary, 'columnName$String')
                    )
                    {
                        let tableName$String = databaseLocation$Dictionary['tableName$String'];
                        let columnName$String = databaseLocation$Dictionary['columnName$String'];

                        sqlRequiredColumnOrConcatenation$String += "`" + tableName$String + "`.`" + columnName$String + "`";
                        if (i + 1 < databaseLocations$ArrayDictionary.length)
                        {
                            sqlRequiredColumnOrConcatenation$String += ", ' ', ";
                        }
                        tables$ArrayString.push(tableName$String);
                    }
                }
                sqlRequiredColumnOrConcatenation$String += ")";
            }

            log.value.write("sqlRequiredColumnOrConcatenation$String", sqlRequiredColumnOrConcatenation$String, log.constants.debug);
            log.value.write("tables$ArrayString", tables$ArrayString, log.constants.debug); // todo: must be unique


            if(test.assertion.notEmpty$Array(tables$ArrayString))
            {
                // let tables$SetString = new Set(tables$ArrayString);

                let sql$String = '';
                //sql$String = "USE `" + databaseName$String + "`; ";
                sql$String += "SELECT ";
                if(test.value.notEmpty$String(partOfSpeech$String)) // todo: now find partOfSpeech$String
                {
                    sql$String += "'" + partOfSpeech$String + "' ";
                }
                else
                {
                    sql$String += "'" + grammar.constants.database.part_of_speech_lookup_column + "' ";
                }
                sql$String += "AS `" + grammar.constants.database.part_of_speech_variable + "`, ";
                sql$String += sqlRequiredColumnOrConcatenation$String + " ";
                sql$String += "AS ?, ";
                sql$String += "INSTR(?, " + sqlRequiredColumnOrConcatenation$String + ") ";
                sql$String += "AS ? ";
                if(test.value.notEmpty$String(jsonToAppend$String))
                {
                    sql$String += ", '" + jsonToAppend$String.replace("'", "") + "' ";
                    sql$String += "AS `" + grammar.constants.database.json_definition_variable + "` ";
                }
                sql$String += "FROM ?? ";
                // todo: support inner join
                // sql$String += (check.value.numberOfItems$Array(databaseLocations$ArrayDictionary) > 1)
                //     ? "INNER JOIN ?? ?? ?? ?? "
                //     : "";
                sql$String += "WHERE INSTR(?, " + sqlRequiredColumnOrConcatenation$String + ") != 0; ";

                log.value.write("sql$String: SQL generated from namesUsingDatabaseLocations", sql$String, log.constants.debug);

                result$ArrayDictionary = await global.pool$DatabaseConnectionPool.runScript
                (
                    databaseName$String,
                    sql$String,
                    [
                        grammar.constants.database.token_string_variable,
                        text$String,
                        grammar.constants.database.string_position_variable,
                        tables$ArrayString[0],
                        text$String
                    ]
                );
            }
        }

        log.function.return("Returning tokens in result$ArrayDictionary from grammar.query.namesUsingDatabaseLocations:", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

};

module.exports = queryFunctions;