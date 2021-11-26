"use strict";

const grammar    = require('.');
const log        = require('../log');
const test       = require('../test');
const text       = require('../text');
const value      = require('../value');

let sqlFunctions = {

    analyzePhrases(interrogatives$ArrayArrayDictionary, comparisons$ArrayArrayDictionary, prepositionals$ArrayArrayDictionary)
    {
        log.function.write("Analyzing phrases to create SQL", log.constants.debug);
        log.value.write("interrogatives$ArrayArrayDictionary", interrogatives$ArrayArrayDictionary, log.constants.debug);
        log.value.write("comparisons$ArrayArrayDictionary", comparisons$ArrayArrayDictionary, log.constants.debug);
        log.value.write("prepositionals$ArrayArrayDictionary", prepositionals$ArrayArrayDictionary, log.constants.debug);

        let selectClauseTokens$ArrayDictionary = this.selectClauseTokens(interrogatives$ArrayArrayDictionary, comparisons$ArrayArrayDictionary, prepositionals$ArrayArrayDictionary);
        log.value.write("Tokens to insert into select clause", selectClauseTokens$ArrayDictionary, log.constants.debug);

        let sql$String = this.createQuery(selectClauseTokens$ArrayDictionary, comparisons$ArrayArrayDictionary, prepositionals$ArrayArrayDictionary);

        return sql$String;
    },

    createQuery(selectClauseTokens$ArrayDictionary, comparisons$ArrayArrayDictionary, prepositionals$ArrayArrayDictionary, treatPrepositionalsAsDates$Boolean = true)
    {
        log.function.write("Create query from tokens and phrases", log.constants.debug);
        log.value.write("selectClauseTokens$ArrayDictionary: Tokens for select clause", selectClauseTokens$ArrayDictionary, log.constants.debug);

        let sql$String = '';

        let uniqueKeys$ArrayDictionary = [];
        let savedDatabaseLocations$ArrayDictionary = [];

        let databaseLocationsForFromClause$SetString = new Set();
        for (let i = 0; i < selectClauseTokens$ArrayDictionary.length; i++)
        {
            let tokenName$String = '';
            if (test.value.hasKey(selectClauseTokens$ArrayDictionary[i], grammar.constants.database.token_string_variable))
                tokenName$String = selectClauseTokens$ArrayDictionary[i][grammar.constants.database.token_string_variable];
            log.value.write("\nCurrent token's name as tokenName$String", tokenName$String, log.constants.debug);

            if (test.value.hasKey(selectClauseTokens$ArrayDictionary[i], grammar.constants.database.database_locations_variable))
            {
                savedDatabaseLocations$ArrayDictionary = selectClauseTokens$ArrayDictionary[i][grammar.constants.database.database_locations_variable];
                log.comment.write("Database locations were added to token as savedDatabaseLocations$ArrayDictionary", savedDatabaseLocations$ArrayDictionary, log.constants.debug);
                log.value.write("Database locations were added to token as savedDatabaseLocations$ArrayDictionary", savedDatabaseLocations$ArrayDictionary, log.constants.debug);

                log.comment.write("Create columns for select statement", log.constants.debug);
                let sqlColumns$String = '';
                if (test.value.notEmpty$String(savedDatabaseLocations$ArrayDictionary) && test.value.notEmpty$String(tokenName$String))
                {
                    for (let databaseLocationIndex$Integer = 0; databaseLocationIndex$Integer < savedDatabaseLocations$ArrayDictionary.length; databaseLocationIndex$Integer++)
                    {
                        log.comment.write("Creating select column using the following values", log.constants.debug);
                        log.value.write("savedDatabaseLocations$ArrayDictionary[" + databaseLocationIndex$Integer + "]", savedDatabaseLocations$ArrayDictionary[databaseLocationIndex$Integer], log.constants.debug);
                        log.comment.write("tokenName$String: '" + tokenName$String + "'", log.constants.debug);

                        let databaseAndTable$String = '';
                        databaseAndTable$String += "`" + savedDatabaseLocations$ArrayDictionary[databaseLocationIndex$Integer][grammar.constants.database.database_name_variable] + "`.";
                        databaseAndTable$String += "`" + savedDatabaseLocations$ArrayDictionary[databaseLocationIndex$Integer][grammar.constants.database.table_name_variable] + "`";

                        sqlColumns$String += databaseAndTable$String + ".";
                        sqlColumns$String += "`" + savedDatabaseLocations$ArrayDictionary[databaseLocationIndex$Integer][grammar.constants.database.column_name_variable] + "`";
                        if (savedDatabaseLocations$ArrayDictionary.length === 1)
                        {
                            sqlColumns$String += " AS ";
                            sqlColumns$String += "`" + tokenName$String + "`";
                        }
                        if (i + 1 < selectClauseTokens$ArrayDictionary.length)
                        {
                            if (savedDatabaseLocations$ArrayDictionary.length >= 2 && (databaseLocationIndex$Integer < savedDatabaseLocations$ArrayDictionary.length - 1)) sqlColumns$String += ", \' \', ";
                            else if (savedDatabaseLocations$ArrayDictionary.length === 1) sqlColumns$String += ", ";
                        }

                        databaseLocationsForFromClause$SetString.add(databaseAndTable$String);
                        log.value.write("Database columns to add to from clause as databaseLocationsForFromClause$SetString", databaseLocationsForFromClause$SetString, log.constants.debug);
                    }
                    if (savedDatabaseLocations$ArrayDictionary.length >= 2) sqlColumns$String = "CONCAT(" + sqlColumns$String + ") AS '" + selectClauseTokens$ArrayDictionary[i][grammar.constants.database.token_string_variable] + "', ";
                    sql$String += sqlColumns$String;

                    log.value.write("Database locations for where clause (part 1) as savedDatabaseLocations$ArrayDictionary", savedDatabaseLocations$ArrayDictionary, log.constants.debug);
                    log.comment.write("Need to get uniqueKey for lookup as uniqueKeys$ArrayDictionary", log.constants.debug);
                }
            }

            log.comment.write("\nYou either have just a JSON definition (below), or both databaseLocations$ArrayDictionary (above) inserted into the token record and JSON definition", log.constants.debug);
            log.comment.write("If you have both, pull uniqueKeys$ArrayDictionary and map those to databaseLocations$ArrayDictionary in where clause\n", log.constants.debug);

            let databaseLocationsFromJSON$ArrayDictionary = [];

            let sqlColumns$String = '';
            // todo: add assertion
            if (test.value.hasKey(selectClauseTokens$ArrayDictionary[i], grammar.constants.database.json_definition_variable))
            {
                let json$Dictionary = value.extract.JSONDefinitionFromToken(selectClauseTokens$ArrayDictionary[i]);
                log.value.write("JSON definition for this token", json$Dictionary, log.constants.debug);

                // todo: change to assertion
                if (test.value.numberOfItems$Array(savedDatabaseLocations$ArrayDictionary) > 0)
                {
                    log.comment.write("Get uniqueKeys$ArrayDictionary because there are already locations in savedDatabaseLocations$ArrayDictionary", log.constants.debug);
                    if (test.value.hasKey(json$Dictionary, grammar.constants.database.unique_keys_variable))
                    {
                        uniqueKeys$ArrayDictionary = json$Dictionary[grammar.constants.database.unique_keys_variable];
                        log.value.write("uniqueKeys$ArrayDictionary: keys to match in where clause for this token", uniqueKeys$ArrayDictionary, log.constants.debug);
                    }
                }
                if (test.value.hasKey(json$Dictionary, grammar.constants.database.database_locations_variable))
                {
                    databaseLocationsFromJSON$ArrayDictionary = json$Dictionary[grammar.constants.database.database_locations_variable];
                    log.value.write("Database locations extracted from JSON as databaseLocationsFromJSON$ArrayDictionary", databaseLocationsFromJSON$ArrayDictionary, log.constants.debug);
                    log.comment.write("Create columns for select statement", log.constants.debug);

                    if (test.value.notEmpty$String(databaseLocationsFromJSON$ArrayDictionary) && test.value.notEmpty$String(tokenName$String))
                    {
                        for (let databaseLocationIndex$Integer = 0; databaseLocationIndex$Integer < databaseLocationsFromJSON$ArrayDictionary.length; databaseLocationIndex$Integer++)
                        {
                            log.comment.write("Creating select column using the following values", log.constants.debug);
                            log.value.write("databaseLocationsFromJSON$ArrayDictionary[" + databaseLocationIndex$Integer + "]", databaseLocationsFromJSON$ArrayDictionary[databaseLocationIndex$Integer], log.constants.debug);
                            log.comment.write("tokenName$String: '" + tokenName$String + "'", log.constants.debug);

                            let databaseAndTable$String = '';
                            databaseAndTable$String += "`" + databaseLocationsFromJSON$ArrayDictionary[databaseLocationIndex$Integer][grammar.constants.database.database_name_variable] + "`.";
                            databaseAndTable$String += "`" + databaseLocationsFromJSON$ArrayDictionary[databaseLocationIndex$Integer][grammar.constants.database.table_name_variable] + "`";

                            sqlColumns$String += databaseAndTable$String + ".";
                            sqlColumns$String += "`" + databaseLocationsFromJSON$ArrayDictionary[databaseLocationIndex$Integer][grammar.constants.database.column_name_variable] + "`";
                            if (databaseLocationsFromJSON$ArrayDictionary.length === 1)
                            {
                                sqlColumns$String += " AS ";
                                sqlColumns$String += "`" + tokenName$String + "`";
                            }
                            if (i + 1 < selectClauseTokens$ArrayDictionary.length)
                            {
                                if (databaseLocationsFromJSON$ArrayDictionary.length >= 2 && (databaseLocationIndex$Integer < databaseLocationsFromJSON$ArrayDictionary.length - 1)) sqlColumns$String += ", \' \', ";
                                else if (databaseLocationsFromJSON$ArrayDictionary.length === 1) sqlColumns$String += ", ";
                            }

                            databaseLocationsForFromClause$SetString.add(databaseAndTable$String);
                            log.value.write("Database columns to add to from clause as databaseLocationsForFromClause$SetString", databaseLocationsForFromClause$SetString, log.constants.debug);
                        }
                    }
                    log.comment.write("Using the token name overwrites the column containing the ID, so only the name is returned", log.constants.debug);
                    if (databaseLocationsFromJSON$ArrayDictionary.length >= 2) sqlColumns$String = "CONCAT(" + sqlColumns$String + ") AS '" + selectClauseTokens$ArrayDictionary[i][grammar.constants.database.token_string_variable] + "', ";
                    sql$String += sqlColumns$String;
                }
            }
        }

        sql$String += " FROM ";
        let databaseLocationsForFromClause$ArrayString = Array.from(databaseLocationsForFromClause$SetString);
        for (let i = 0; i < databaseLocationsForFromClause$ArrayString.length; i++)
        {
            sql$String += databaseLocationsForFromClause$ArrayString[i];
            if (i + 1 < databaseLocationsForFromClause$ArrayString.length) sql$String += ", ";
        }


        sql$String += " WHERE ";

        log.value.write("Tokens for creating comparisons", comparisons$ArrayArrayDictionary, log.constants.debug);
        log.comment.write("Comparisons can be explicit or implied (i.e. more than 30 home runs and 30 RBIs, more than 30 home runs and RBIs)", log.constants.debug);

        // comparison, number, noun_aggregate, [number], [noun_aggregate]

        let generatedComparisons$ArrayString = [];
        let andRequired$Boolean = false;

        for (let i = 0; i < comparisons$ArrayArrayDictionary.length; i++)
        {
            let comparison$String = '';
            let columnIsSet$Boolean = false;
            let comparisonIsSet$Boolean = false;
            let valueIsSet$Boolean = false;
            let lastComparison$String = '';
            for (let j = 0; j < comparisons$ArrayArrayDictionary[i].length; j++)
            {
                if (test.assertion.notEmpty$String(comparisons$ArrayArrayDictionary[i][j][grammar.constants.database.part_of_speech_variable]))
                {
                    let partOfSpeech$String = comparisons$ArrayArrayDictionary[i][j][grammar.constants.database.part_of_speech_variable];
                    log.value.write("Current part of speech as partOfSpeech$String", partOfSpeech$String, log.constants.debug);

                    if (test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.comparison_greater.name))
                    {
                        comparison$String = ">=";
                        lastComparison$String = comparison$String;
                        comparisonIsSet$Boolean = true;
                        log.value.write("Added operator to comparison$String", comparison$String, log.constants.debug);
                    }
                    else if (test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.comparison_less.name))
                    {
                        comparison$String = "<=";
                        lastComparison$String = comparison$String;
                        comparisonIsSet$Boolean = true;
                        log.value.write("Added operator to comparison$String", comparison$String, log.constants.debug);
                    }
                    else
                    {
                        log.comment.write("Assuming comparisonOperator$String is added first, append or prepend strings as needed", log.constants.debug);
                        if (test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.noun_math_number.name))
                        {
                            if (test.value.notEmpty$String(lastComparison$String) && !comparisonIsSet$Boolean)
                            {
                                // start new comparison with lastComparison$String as default
                                comparison$String = lastComparison$String;
                                comparisonIsSet$Boolean = true;
                            }
                            comparison$String += " ";
                            comparison$String += comparisons$ArrayArrayDictionary[i][j][grammar.constants.database.token_string_variable];
                            valueIsSet$Boolean = true;
                            log.value.write("Added value to comparison$String", comparison$String, log.constants.debug);
                        }
                        else if (test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.noun_aggregate.name))
                        {
                            if (test.value.notEmpty$String(lastComparison$String) && !comparisonIsSet$Boolean)
                            {
                                // start new comparison with lastComparison$String as default
                                comparison$String = lastComparison$String;
                                comparisonIsSet$Boolean = true;
                            }
                            let json$Dictionary = value.extract.JSONDefinitionFromToken(comparisons$ArrayArrayDictionary[i][j]);
                            log.value.write("JSON dictionary for this part of where clause", json$Dictionary, log.constants.debug);

                            // todo: change to assertion
                            if (test.value.hasKey(json$Dictionary, grammar.constants.database.database_locations_variable))
                            {
                                let databaseLocations$ArrayDictionary = json$Dictionary[grammar.constants.database.database_locations_variable];
                                log.value.write("Database locations extracted from JSON as databaseLocations$ArrayDictionary", databaseLocations$ArrayDictionary, log.constants.debug);

                                log.comment.write("noun_aggregates have only one database location", log.constants.debug);
                                let databaseTableAndColumn$String = '';
                                databaseTableAndColumn$String += "`" + databaseLocations$ArrayDictionary[0][grammar.constants.database.database_name_variable] + "`.";
                                databaseTableAndColumn$String += "`" + databaseLocations$ArrayDictionary[0][grammar.constants.database.table_name_variable] + "`.";
                                databaseTableAndColumn$String += "`" + databaseLocations$ArrayDictionary[0][grammar.constants.database.column_name_variable] + "`";

                                comparison$String = databaseTableAndColumn$String + " " + comparison$String;
                                columnIsSet$Boolean = true;
                                log.value.write("Added column to comparison$String", comparison$String, log.constants.debug);
                            }
                        }
                    }

                    if (columnIsSet$Boolean && comparisonIsSet$Boolean && valueIsSet$Boolean)
                    {
                        andRequired$Boolean = true;
                        generatedComparisons$ArrayString.push(comparison$String);
                        log.value.write("Comparisons generated thus far as generatedComparisons$ArrayString", generatedComparisons$ArrayString, log.constants.debug);
                        columnIsSet$Boolean = false;
                        comparisonIsSet$Boolean = false;
                        valueIsSet$Boolean = false;
                    }
                }
            }
        }

        log.value.write("Comparisons to append to where clause as generatedComparisons$ArrayString", generatedComparisons$ArrayString, log.constants.debug);
        log.value.write("Current sql$String", sql$String, log.constants.debug);
        for (let i = 0; i < generatedComparisons$ArrayString.length; i++)
        {
            sql$String += "(" + generatedComparisons$ArrayString[i] + ")";
            if (i < generatedComparisons$ArrayString.length - 1) sql$String += " AND ";
            log.value.write("Current sql$String", sql$String, log.constants.debug);
        }

        let clauseToForeignKeysAndUniqueKeys$String = '';
        if (test.value.notEmpty$Array(uniqueKeys$ArrayDictionary) && test.value.notEmpty$Array(savedDatabaseLocations$ArrayDictionary))
        {
            log.comment.write("Add where clause for unique and foreign keys; used when a name is substituted in a search for a key", log.constants.debug);
            log.value.write("uniqueKeys$ArrayDictionary", uniqueKeys$ArrayDictionary, log.constants.debug);
            log.value.write("savedDatabaseLocations$ArrayDictionary", savedDatabaseLocations$ArrayDictionary, log.constants.debug);

            if (andRequired$Boolean) sql$String += " AND /* 1 */";

            // Add check for equal lengths
            for (let i = 0; i < uniqueKeys$ArrayDictionary.length; i++)
            {
                clauseToForeignKeysAndUniqueKeys$String += "(";
                clauseToForeignKeysAndUniqueKeys$String += value.convert.toStringFromToken(uniqueKeys$ArrayDictionary[i]);
                clauseToForeignKeysAndUniqueKeys$String += " = ";
                clauseToForeignKeysAndUniqueKeys$String += value.convert.toStringFromToken(savedDatabaseLocations$ArrayDictionary[i]);
                clauseToForeignKeysAndUniqueKeys$String += ")";
            }
        }
        sql$String += clauseToForeignKeysAndUniqueKeys$String;

        log.value.write("Tokens for comparisons", comparisons$ArrayArrayDictionary, log.constants.debug);
        log.value.write("Tokens for creating prepositionals", prepositionals$ArrayArrayDictionary, log.constants.debug);
        log.comment.write("If there are comparisons already, prepositionals are often dates", log.constants.debug);

        if (test.value.notEmpty$Array(comparisons$ArrayArrayDictionary))
        {
            treatPrepositionalsAsDates$Boolean = true;
            log.value.write("Treating prepositionals as dates", treatPrepositionalsAsDates$Boolean, log.constants.debug);
        }

        let prepositionalComparisons$ArrayDictionary = [];
        if (test.value.notEmpty$Array(prepositionals$ArrayArrayDictionary))
        {
            log.comment.write("Add expressions based on prepositionals", log.constants.debug);
            log.comment.write("Grammatically prepositionals are likely to have objects that are implied (e.g. 'between 2000 and 2010' is a date)", log.constants.debug);

            if (andRequired$Boolean) sql$String += " AND  /* 2 */";
            for (let i = 0; i < prepositionals$ArrayArrayDictionary.length; i++)
            {
                let prepositionalComparison$String = '';

                let prepositionalObject$Dictionary = grammar.parse.nextObject(prepositionals$ArrayArrayDictionary[i]);
                log.value.write("Prepositional object to use for left side of expression as prepositionalObject$Dictionary", prepositionalObject$Dictionary, log.constants.debug);

                let partOfSpeech$String = prepositionals$ArrayArrayDictionary[i][0][grammar.constants.database.part_of_speech_variable];
                log.value.write("partOfSpeech$String: check preposition that prepositional begins with", partOfSpeech$String, log.constants.debug);

                let nouns$ArrayDictionary = grammar.parse.nextNounPhrase(prepositionals$ArrayArrayDictionary[i], 0, true);
                log.value.write("List of nouns to use for prepositionals", nouns$ArrayDictionary, log.constants.debug);

                let objectTokens$ArrayDictionary = [];
                let nounGroups$ArrayArrayDictionary = [];
                log.comment.write("The indexes of object tokens and noun groups are related. Object token 1 belongs with noun group array dictionary 1", log.constants.debug);
                log.comment.write("Sometimes a noun object will appear first (e.g. years 2000), other times last (between 1 and 10 hits)", log.constants.debug);
                log.comment.write("If they appear last, there will be an empty elements that needs to be cleared in nounGroups$ArrayArrayDictionary", log.constants.debug);

                let primaryPartOfSpeechType$String = '';
                let nounGroup$Integer = -1;
                let currentNouns$ArrayDictionary = [];
                for (let nounIndex$Integer = 0; nounIndex$Integer < nouns$ArrayDictionary.length; nounIndex$Integer++)
                {
                    let currentPartOfSpeech$String = nouns$ArrayDictionary[nounIndex$Integer][grammar.constants.database.part_of_speech_variable];
                    log.value.write("Current token", nouns$ArrayDictionary[nounIndex$Integer], log.constants.debug);
                    log.value.write("currentPartOfSpeech$String", currentPartOfSpeech$String, log.constants.debug);

                    if (test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.object.name))
                    {
                        nounGroup$Integer++;
                        log.value.write("Incrementing nounGroup$Integer", nounGroup$Integer, log.constants.debug);

                        nounGroups$ArrayArrayDictionary.push(currentNouns$ArrayDictionary);
                        log.value.write("Pushing currentNouns$ArrayDictionary into nounGroups$ArrayArrayDictionary", nounGroups$ArrayArrayDictionary, log.constants.debug);

                        objectTokens$ArrayDictionary.push(nouns$ArrayDictionary[nounIndex$Integer]);
                        log.value.write("Pushing nouns$ArrayDictionary[nounIndex$Integer] into objectTokens$ArrayDictionary", objectTokens$ArrayDictionary, log.constants.debug);

                        currentNouns$ArrayDictionary = [];
                    }
                    else
                    {
                        currentNouns$ArrayDictionary.push(nouns$ArrayDictionary[nounIndex$Integer]);
                        log.value.write("currentNouns$ArrayDictionary", currentNouns$ArrayDictionary, log.constants.debug);
                    }
                }
                nounGroups$ArrayArrayDictionary.push(currentNouns$ArrayDictionary);
                log.value.write("nounGroups$ArrayArrayDictionary", nounGroups$ArrayArrayDictionary, log.constants.debug);

                nounGroups$ArrayArrayDictionary = nounGroups$ArrayArrayDictionary.filter((element$ArrayDictionary) => element$ArrayDictionary.length);
                log.value.write("Removed any empty elements from nounGroups$ArrayArrayDictionary", nounGroups$ArrayArrayDictionary, log.constants.debug);

                log.value.write("Use these values for left hand side of expressions as objectTokens$ArrayDictionary", objectTokens$ArrayDictionary, log.constants.debug);
                log.comment.write("If none are available, do a database lookup based on the main noun part of speech in nounGroups$ArrayArrayDictionary (e.g. look up all noun_math_number_objects in database)", log.constants.debug);
                log.comment.write("Be sure to match with existing tables", log.constants.debug);

                let tableNamesForNounGroups$ArrayString = [];
                let columnVariableNamesForNounGroups$ArrayString = [];
                if (!test.value.empty$Dictionary(objectTokens$ArrayDictionary))
                {
                    log.value.write("Match tables from saved database locations with any objects in preposition as savedDatabaseLocations$ArrayDictionary", savedDatabaseLocations$ArrayDictionary, log.constants.debug);
                    log.comment.write("savedDatabaseLocations$ArrayDictionary are the tables in the from clause of this SQL statement", log.constants.debug);

                    for (let objectTokenIndex$Integer = 0; objectTokenIndex$Integer < objectTokens$ArrayDictionary.length; objectTokenIndex$Integer++)
                    {
                        log.comment.write("Check foreign keys of object tokens against saved database locations", log.constants.debug);
                        log.value.write("Current object token as objectTokens$ArrayDictionary[" + objectTokenIndex$Integer + "]", objectTokens$ArrayDictionary[objectTokenIndex$Integer], log.constants.debug);

                        let json$Dictionary = value.extract.JSONDefinitionFromToken(objectTokens$ArrayDictionary[objectTokenIndex$Integer]);
                        let tableNameForNounGroup$String = '';
                        let variableNameForNounGroup$String = '';
                        log.value.write("JSON definition for object token and extracting foriegn keys as json$Dictionary", json$Dictionary, log.constants.debug);

                        if (test.assertion.hasKey(json$Dictionary, grammar.constants.database.alias_variable))
                            variableNameForNounGroup$String = json$Dictionary[grammar.constants.database.alias_variable];

                        if (test.assertion.hasKey(json$Dictionary, grammar.constants.database.foreign_key_variable))
                        {
                            let foreignKeysOfObjectToken$ArrayDictionary = json$Dictionary[grammar.constants.database.foreign_key_variable];
                            log.value.write("Testing foreign keys against saved database locations as foreignKeysOfObjectToken$ArrayDictionary", foreignKeysOfObjectToken$ArrayDictionary, log.constants.debug);

                            for (let foreignKeyIndex$Integer = 0; foreignKeyIndex$Integer < foreignKeysOfObjectToken$ArrayDictionary.length; foreignKeyIndex$Integer++)
                            {
                                for (let savedLocationIndex$Integer = 0; savedLocationIndex$Integer < savedDatabaseLocations$ArrayDictionary.length; savedLocationIndex$Integer++)
                                {
                                    log.value.write("Saved database location " + savedLocationIndex$Integer, savedDatabaseLocations$ArrayDictionary[savedLocationIndex$Integer], log.constants.debug);

                                    let databaseName$String = savedDatabaseLocations$ArrayDictionary[savedLocationIndex$Integer][grammar.constants.database.database_name_variable];
                                    log.value.write("Saved database location database name as databaseName$String", databaseName$String, log.constants.debug);

                                    let foreignKeyDatabaseName$String = foreignKeysOfObjectToken$ArrayDictionary[foreignKeyIndex$Integer][grammar.constants.database.database_name_variable];
                                    log.value.write("Foreign key database location database name as foreignKeyDatabaseName$String", foreignKeyDatabaseName$String, log.constants.debug);

                                    let tableName$String = savedDatabaseLocations$ArrayDictionary[savedLocationIndex$Integer][grammar.constants.database.table_name_variable];
                                    log.value.write("Saved database location table name as tableName$String", tableName$String, log.constants.debug);

                                    let foreignKeyTableName$String = foreignKeysOfObjectToken$ArrayDictionary[foreignKeyIndex$Integer][grammar.constants.database.table_name_variable];
                                    log.value.write("Foreign key database location table name as foreignKeyTableName$String", foreignKeyTableName$String, log.constants.debug);

                                    let foreignKeyColumnName$String = foreignKeysOfObjectToken$ArrayDictionary[foreignKeyIndex$Integer][grammar.constants.database.column_name_variable];
                                    log.value.write("Foreign key database location column name as foreignKeyColumnName$String", foreignKeyColumnName$String, log.constants.debug);

                                    if
                                    (
                                        test.value.equal$String(databaseName$String, foreignKeyDatabaseName$String) &&
                                        test.value.equal$String(tableName$String, foreignKeyTableName$String)
                                    )
                                    {
                                        log.comment.write("Matched database and table name with foreign key of token to compare to preposition nouns", log.constants.debug);
                                        tableNameForNounGroup$String += "`" + foreignKeyDatabaseName$String + "`.";
                                        tableNameForNounGroup$String += "`" + foreignKeyTableName$String + "`.";
                                        tableNameForNounGroup$String += "`" + foreignKeyColumnName$String + "`";

                                        variableNameForNounGroup$String = tableNameForNounGroup$String + " AS \"" + variableNameForNounGroup$String + "\"";
                                    }
                                }
                                if (!test.value.empty$String(tableNameForNounGroup$String)) break;
                            }
                            if (!test.value.empty$String(tableNameForNounGroup$String))
                            {
                                tableNamesForNounGroups$ArrayString.push(tableNameForNounGroup$String);
                                columnVariableNamesForNounGroups$ArrayString.push(variableNameForNounGroup$String);
                                break;
                            }
                        }
                    }
                }
                else
                {
                    // todo: database lookup for implied object; use the main noun part of speech in nounGroups$ArrayArrayDictionary
                }

                log.value.write("Table names array that corresponds to noun groups array as tableNamesForNounGroups$ArrayString", tableNamesForNounGroups$ArrayString, log.constants.debug);
                log.value.write("Noun groups array as nounGroups$ArrayArrayDictionary", nounGroups$ArrayArrayDictionary, log.constants.debug);

                log.comment.write("Iterate over each noun group, add those values to right side of comparison", log.constants.debug);
                log.comment.write("Map table names array to left side of comparison", log.constants.debug);

                let prepositionExpressions$ArrayString = [];
                for (let nounGroupIndex$Integer = 0; nounGroupIndex$Integer < nounGroups$ArrayArrayDictionary.length; nounGroupIndex$Integer++)
                {
                    let numberOfNounsForRightSideOfExpression$Integer = test.value.numberOfItems$Array(nounGroups$ArrayArrayDictionary[nounGroupIndex$Integer]);
                    let prepositionExpression$String = '';
                    log.value.write("Length of noun list as numberOfNounsForRightSideOfExpression$Integer", numberOfNounsForRightSideOfExpression$Integer, log.constants.debug);
                    log.value.write("Preposition part of speech as partOfSpeech$String", partOfSpeech$String, log.constants.debug);

                    if
                    (
                        test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.preposition_start_range.name) ||
                        test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.preposition_end_range.name)
                    )
                    {
                        log.comment.write("If noun_math_numbers, use that for the entire range. If even number of noun_math_numbers, pair them in ranges. If odd, treat the last number as the start of the next range", log.constants.debug);

                        if (numberOfNounsForRightSideOfExpression$Integer === 1)
                        {
                            prepositionExpression$String += tableNamesForNounGroups$ArrayString[nounGroupIndex$Integer];
                            prepositionExpression$String += test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.preposition_start_range.name)
                                ? " >= "
                                : " <= ";
                            prepositionExpression$String += nounGroups$ArrayArrayDictionary[nounGroupIndex$Integer][0][grammar.constants.database.token_string_variable];
                            log.value.write("prepositionExpression$String", prepositionExpression$String, log.constants.debug);
                        }
                        else
                        {
                            log.comment.write("Taking two values from nounGroups$ArrayArrayDictionary " + nounGroupIndex$Integer + " at a time and creating expression", log.constants.debug);

                            let nounMaximumIndexBecauseOfPairs$Integer = 0;
                            let unpairedNounForExpression$Boolean = false;
                            if (numberOfNounsForRightSideOfExpression$Integer % 2 === 0)
                                nounMaximumIndexBecauseOfPairs$Integer = numberOfNounsForRightSideOfExpression$Integer;
                            else
                            {
                                nounMaximumIndexBecauseOfPairs$Integer = numberOfNounsForRightSideOfExpression$Integer - 1;
                                unpairedNounForExpression$Boolean = true;
                            }
                            let nounIndex$Integer = 0;
                            for (nounIndex$Integer = 0; nounIndex$Integer < nounMaximumIndexBecauseOfPairs$Integer; nounIndex$Integer++)
                            {
                                prepositionExpression$String += "(";
                                prepositionExpression$String += tableNamesForNounGroups$ArrayString[nounGroupIndex$Integer];
                                prepositionExpression$String += " >= ";
                                prepositionExpression$String += nounGroups$ArrayArrayDictionary[nounGroupIndex$Integer][nounIndex$Integer][grammar.constants.database.token_string_variable];
                                prepositionExpression$String += ")";

                                prepositionExpression$String += " AND  /* 3 */";

                                prepositionExpression$String += "(";
                                prepositionExpression$String += tableNamesForNounGroups$ArrayString[nounGroupIndex$Integer];
                                prepositionExpression$String += " <= ";
                                prepositionExpression$String += nounGroups$ArrayArrayDictionary[nounGroupIndex$Integer][++nounIndex$Integer][grammar.constants.database.token_string_variable];
                                prepositionExpression$String += ")";

                                if (nounIndex$Integer < nounMaximumIndexBecauseOfPairs$Integer - 1)
                                    prepositionExpression$String += " OR ";

                                log.value.write("prepositionExpression$String", prepositionExpression$String, log.constants.debug);
                            }
                            if (unpairedNounForExpression$Boolean)
                            {
                                prepositionExpression$String += " OR ";
                                prepositionExpression$String += "(";
                                prepositionExpression$String += tableNamesForNounGroups$ArrayString[nounGroupIndex$Integer];
                                prepositionExpression$String += " IN(";
                                prepositionExpression$String += "'" + nounGroups$ArrayArrayDictionary[nounGroupIndex$Integer][nounIndex$Integer][grammar.constants.database.token_string_variable] + "'";
                                prepositionExpression$String += ")";
                                prepositionExpression$String += ")";
                                log.value.write("prepositionExpression$String", prepositionExpression$String, log.constants.debug);
                            }
                        }
                        prepositionExpressions$ArrayString.push(prepositionExpression$String);
                        log.value.write("prepositionExpressions$ArrayString", prepositionExpressions$ArrayString, log.constants.debug);
                    }
                    else if (test.value.equal$String(partOfSpeech$String, grammar.constants.partsOfSpeech.preposition_start_list.name))
                    {

                        log.comment.write("Expects one or more noun_math_numbers", log.constants.debug);
                        prepositionExpression$String += tableNamesForNounGroups$ArrayString[nounGroupIndex$Integer];
                        prepositionExpression$String += " IN(";
                        for (let nounIndexIn$Integer = 0; nounIndexIn$Integer < numberOfNounsForRightSideOfExpression$Integer; nounIndexIn$Integer++)
                        {
                            prepositionExpression$String += "'" + nounGroups$ArrayArrayDictionary[nounGroupIndex$Integer][nounIndexIn$Integer][grammar.constants.database.token_string_variable] + "'";
                            if (nounIndexIn$Integer < numberOfNounsForRightSideOfExpression$Integer - 1) prepositionExpression$String += ", ";
                        }
                        prepositionExpression$String += ")";
                        prepositionExpressions$ArrayString.push(prepositionExpression$String);
                        log.value.write("prepositionExpression$String", prepositionExpression$String, log.constants.debug);
                    }
                    // todo: support "separately", which queues multiple queries
                }

                for (let expressionIndex$Integer = 0; expressionIndex$Integer < prepositionExpressions$ArrayString.length; expressionIndex$Integer++)
                {
                    sql$String += "(((" + prepositionExpressions$ArrayString[expressionIndex$Integer] + ")))";
                    if (expressionIndex$Integer < prepositionExpressions$ArrayString.length - 1) sql$String += ' AND  /* 4 */';
                }

                let additionalColumnVariables$String = '';
                log.comment.write("Add columns for noun groups from prepositions", log.constants.debug);
                for (let columnIndex$Integer = 0; columnIndex$Integer < columnVariableNamesForNounGroups$ArrayString.length; columnIndex$Integer++)
                {
                    additionalColumnVariables$String += columnVariableNamesForNounGroups$ArrayString[columnIndex$Integer] + ", ";
                }
                sql$String = additionalColumnVariables$String + sql$String;
                log.value.write("sql$String after columns for noun groups have been added", sql$String, log.constants.debug);
            }
        }

        sql$String = "SELECT " + sql$String + " LIMIT 1000; ";
        sql$String = text.remove.extraSpaces(sql$String);
        sql$String = text.remove.backslashes(sql$String);

        log.function.return("Returning sql$String from createQuery", sql$String, log.constants.debug);
        return sql$String;
    },

    selectClauseTokens(interrogatives$ArrayArrayDictionary, comparisons$ArrayArrayDictionary, prepositionals$ArrayArrayDictionary)
    {
        log.function.write("Create select statement", log.constants.debug);

        let result$ArrayDictionary = [];

        // Check interrogatives
        // If tables don't converge, subjects may be unrelated; inform user (e.g. if tablesForSubjectListQueries$ArrayDictionary is empty)
        // If subject has foreignKeys$ArrayDictionary, it needs to converge with the noun aggregates in the other clauses
        // If subject is a noun_aggregate, the user is looking for a sum, min, max, or average; this will be supported in a future release

        log.comment.write("Phrases to parse for select clause:", log.constants.debug);
        log.value.write("interrogatives$ArrayArrayDictionary", interrogatives$ArrayArrayDictionary, log.constants.debug);
        log.value.write("comparisons$ArrayArrayDictionary", comparisons$ArrayArrayDictionary, log.constants.debug);
        log.value.write("prepositionals$ArrayArrayDictionary", prepositionals$ArrayArrayDictionary, log.constants.debug);

        let subjectLists$ArrayArrayDictionary = [];
        log.comment.write("Checking interrogatives for the main subjects of the SQL query", log.constants.debug);
        log.comment.write("Subject lists include interrogative and object (e.g. Which position players)", log.constants.debug);
        log.comment.write("There can be multiple interrogatives (e.g. Which position players for what teams)", log.constants.debug);

        if (test.value.notEmpty$Array(interrogatives$ArrayArrayDictionary))
        {
            for (let i = 0; i < interrogatives$ArrayArrayDictionary.length; i++)
            {
                let interrogative$ArrayDictionary = interrogatives$ArrayArrayDictionary[i];
                log.value.write("interrogative$ArrayDictionary", interrogative$ArrayDictionary, log.constants.debug);

                // todo: get interrogative type
                // todo: if there is a number here, use that or lesser number as limit
                if (test.value.notEmpty$Array(interrogative$ArrayDictionary))
                {
                    let nounPhrase$ArrayDictionary = grammar.parse.nextNounPhrase(interrogative$ArrayDictionary, 0, true);
                    log.value.write("Subjects of interrogative " + i + " as subjectLists$ArrayArrayDictionary", subjectLists$ArrayArrayDictionary, log.constants.debug);

                    subjectLists$ArrayArrayDictionary.push(nounPhrase$ArrayDictionary);
                }
            }
        }

        log.value.write("Subjects of select clause as subjectLists$ArrayArrayDictionary", subjectLists$ArrayArrayDictionary, log.constants.debug);

        let supportingData$ArrayArrayDictionary = [];
        log.comment.write("Match the tables for supporting data with available foreignKeys$ArrayDictionary in subjectLists$ArrayArrayDictionary", log.constants.debug);
        log.comment.write("Keep the loops separate because they may diverge in the future", log.constants.debug);

        if (test.value.notEmpty$Array(comparisons$ArrayArrayDictionary))
        {
            for (let i = 0; i < comparisons$ArrayArrayDictionary.length; i++)
            {
                let comparison$ArrayDictionary = comparisons$ArrayArrayDictionary[i];
                if (test.value.notEmpty$Array(comparison$ArrayDictionary))
                {
                    let excludedTypes$SetString = new Set([grammar.constants.partsOfSpeech.noun_math_number.name]);
                    let nounPhrase$ArrayDictionary = grammar.parse.nextNounPhrase(comparison$ArrayDictionary, 0, true, excludedTypes$SetString);
                    log.value.write("Data supporting subjects of SQL query " + i + " as nounPhrase$ArrayDictionary", nounPhrase$ArrayDictionary, log.constants.debug);

                    supportingData$ArrayArrayDictionary.push(nounPhrase$ArrayDictionary);
                }
            }
        }

        log.value.write("Supporting data for select clause as subjectLists$ArrayArrayDictionary", supportingData$ArrayArrayDictionary, log.constants.debug);

        // todo: Support not having foreign keys (i.e. an aggregate is the subject)
        let tablesForSubjectListQueries$ArrayDictionary = [];
        for (let i = 0; i < subjectLists$ArrayArrayDictionary.length; i++)
        {
            let subjectList$ArrayDictionary = subjectLists$ArrayArrayDictionary[i];

            tablesForSubjectListQueries$ArrayDictionary.push(this.chooseTablesForSubject(subjectLists$ArrayArrayDictionary[i], supportingData$ArrayArrayDictionary));
            log.value.write("Added tables for query " + i + " to tablesForSubjectListQueries$ArrayDictionary", tablesForSubjectListQueries$ArrayDictionary, log.constants.debug);
            log.comment.write("Create one SQL query per subject", log.constants.debug);

        }

        log.value.write("subjectLists$ArrayArrayDictionary", subjectLists$ArrayArrayDictionary, log.constants.debug);

        for (let i = 0; i < subjectLists$ArrayArrayDictionary.length; i++)
        {
            for (let j = 0; j < subjectLists$ArrayArrayDictionary[i].length; j++)
            {
                subjectLists$ArrayArrayDictionary[i][j][grammar.constants.database.database_locations_variable] = tablesForSubjectListQueries$ArrayDictionary[i];
            }
        }
        log.value.write("Assigned lookup tables to subjects. Be sure to check if databaseLocations$ArrayDictionary is available before using database locations in JSON", subjectLists$ArrayArrayDictionary, log.constants.debug);

        let result$ArrayArrayDictionary = subjectLists$ArrayArrayDictionary.concat(supportingData$ArrayArrayDictionary);
        log.function.return("result$ArrayArrayDictionary", result$ArrayArrayDictionary, log.constants.debug);

        result$ArrayDictionary = value.convert.toArrayFromArrayArray(result$ArrayArrayDictionary);
        log.function.return("Returning result$ArrayDictionary from selectClauseTokens", result$ArrayArrayDictionary, log.constants.debug);

        return result$ArrayDictionary;

    },

    chooseTablesForSubject(subjectList$ArrayDictionary, supportingData$ArrayArrayDictionary)
    {
        log.function.write("Choose foreign key tables to use in query based on tables used to get supporting data", log.constants.debug);
        log.value.write("SQL query list of subjects as subjectList$ArrayDictionary", subjectList$ArrayDictionary, log.constants.debug);
        log.value.write("Tables used for refining the query for the subject matter as supportingData$ArrayDictionary", supportingData$ArrayArrayDictionary, log.constants.debug);

        let result$ArrayDictionary = [];

        let supportingDataTokens$ArrayDictionary = value.convert.toArrayFromArrayArray(supportingData$ArrayArrayDictionary);
        log.value.write("List of supporting tokens to check as supportingDataTokens$ArrayDictionary", supportingDataTokens$ArrayDictionary, log.constants.debug);

        let listOfMatches$SetDictionary = new Set();
        for (let subjectList$Dictionary of subjectList$ArrayDictionary)
        {
            log.value.write("subjectList$Dictionary", subjectList$Dictionary, log.constants.debug);

            let jsonFromSubject$Dictionary = value.extract.JSONDefinitionFromToken(subjectList$Dictionary);
            log.value.write("JSON definition from SQL query subject as jsonFromSubject$Dictionary", jsonFromSubject$Dictionary, log.constants.debug);

            let foreignKeys$ArrayDictionary = jsonFromSubject$Dictionary[grammar.constants.database.foreign_key_variable];
            log.value.write("SQL query subject available tables as foreignKeys$ArrayDictionary", foreignKeys$ArrayDictionary, log.constants.debug);
            log.comment.write("Match the tables in supportingData$ArrayArrayDictionary to the tables in foreignKeys$ArrayDictionary", log.constants.debug);

            if (test.value.notEmpty$Array(foreignKeys$ArrayDictionary))
            {
                for (let foreignKey$Dictionary of foreignKeys$ArrayDictionary)
                {
                    log.value.write("foreignKey$Dictionary", foreignKey$Dictionary, log.constants.debug);

                    let foreignKeyDatabaseName$String = foreignKey$Dictionary[grammar.constants.database.database_name_variable];
                    log.value.write("foreignKeyDatabaseName$String", foreignKeyDatabaseName$String, log.constants.debug);

                    let foreignKeyTableName$String = foreignKey$Dictionary[grammar.constants.database.table_name_variable];
                    log.value.write("foreignKeyTableName$String", foreignKeyTableName$String, log.constants.debug);

                    for (let supportingDataToken$Dictionary of supportingDataTokens$ArrayDictionary)
                    {
                        log.value.write("supportingDataToken$Dictionary", supportingDataToken$Dictionary, log.constants.debug);

                        let json$Dictionary = value.extract.JSONDefinitionFromToken(supportingDataToken$Dictionary);
                        log.value.write("json$Dictionary", json$Dictionary, log.constants.debug);

                        let databaseLocations$ArrayDictionary = json$Dictionary[grammar.constants.database.database_locations_variable];
                        log.value.write("databaseLocations$ArrayDictionary", databaseLocations$ArrayDictionary, log.constants.debug);

                        for (let databaseLocation$Dictionary of databaseLocations$ArrayDictionary)
                        {
                            log.value.write("databaseLocation$Dictionary", databaseLocation$Dictionary, log.constants.debug);

                            let databaseName$String = databaseLocation$Dictionary[grammar.constants.database.database_name_variable];
                            log.value.write("databaseName$String", databaseName$String, log.constants.debug);

                            let tableName$String = databaseLocation$Dictionary[grammar.constants.database.table_name_variable];
                            log.value.write("tableName$String", tableName$String, log.constants.debug);

                            if
                            (
                                test.value.equal$String(foreignKeyDatabaseName$String, databaseName$String) &&
                                test.value.equal$String(foreignKeyTableName$String, tableName$String)
                            )
                            {
                                listOfMatches$SetDictionary.add(foreignKey$Dictionary);
                                log.value.write("listOfMatches$SetDictionary", listOfMatches$SetDictionary, log.constants.debug);
                            }
                        }
                    }
                }
            }
        }
        result$ArrayDictionary = [...listOfMatches$SetDictionary];

        log.function.return("Returning result$ArrayDictionary from chooseTables", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    }

};

module.exports = sqlFunctions;


