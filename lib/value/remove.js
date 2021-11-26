"use strict";

const database  = require('../database');
const log       = require('../log');

let removalFunctions =
{
    fieldFromDatabaseColumnInfo (databaseColumnInfo$ArrayDictionary, columnName$String = database.constants.identifiers.internal_row)
    {
        log.function.write("Removing field from database column info", log.constants.debug);

        log.value.write("databaseColumnInfo$ArrayDictionary", databaseColumnInfo$ArrayDictionary, log.constants.debug);

        let updatedDatabaseColumnInfo$ArrayDictionary = databaseColumnInfo$ArrayDictionary.filter(
            (columnInfo$Dictionary) =>
            {
                log.comment.write("columnInfo$Dictionary['Field']: " + columnInfo$Dictionary['Field'], log.constants.debug);
                log.comment.write("columnName$String: " + columnName$String, log.constants.debug);
                return columnInfo$Dictionary['Field'] !== columnName$String;
            }
        );

        return updatedDatabaseColumnInfo$ArrayDictionary;
    }
};

module.exports = removalFunctions;