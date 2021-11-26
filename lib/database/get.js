"use strict";

const database  = require('../database');
const log       = require('../log');
const test      = require('../test');
const value     = require('../value');

let getFunctions = {

    databaseTableColumns(databaseName$String, tableName$String, includeInternalRowID$Boolean = false)
    {
        //  Returns array similar to this format:
        //   [{ Field: 'CS',
        //     Type: 'decimal(20,10)',
        //     Null: 'YES',
        //     Key: '',
        //     Default: null,
        //     Extra: '' },...
        log.function.write("Get database table columns", log.constants.debug);
        log.value.write("databaseName$String", databaseName$String, log.constants.debug);
        log.value.write("tableName$String", tableName$String, log.constants.debug);

        let sql$String = '';
        sql$String += "SHOW COLUMNS FROM ??;";

        if (test.assertion.notEmpty$String(databaseName$String) && test.assertion.notEmpty$String(tableName$String))
        {
            return pool$DatabaseConnectionPool.runScript(
                databaseName$String,
                sql$String,
                [tableName$String]
            ).then(
                (databaseColumnInfo$ArrayDictionary) =>
                {
                    if (
                        !includeInternalRowID$Boolean
                        && test.value.notEmpty$Array(databaseColumnInfo$ArrayDictionary)
                    )
                    {
                        log.comment.write("Removing internal ID element", log.constants.debug);
                        databaseColumnInfo$ArrayDictionary = value.remove.fieldFromDatabaseColumnInfo(
                            databaseColumnInfo$ArrayDictionary,
                            database.constants.identifiers.internal_row
                        );
                    }
                    log.value.write("Database column info as ", databaseColumnInfo$ArrayDictionary, log.constants.debug);
                    return databaseColumnInfo$ArrayDictionary;
                }
            )
        }
    }

};

module.exports = getFunctions;