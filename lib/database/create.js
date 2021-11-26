"use strict";

const log   = require('../log');
const test  = require('../test');

let createFunctions = {

    table(databaseName$String, tableName$String, columnNamesAndTypes$Dictionary)
    {
        log.function.write("Create database table", log.constants.debug);
        log.value.write("columnNamesAndTypes$Dictionary", columnNamesAndTypes$Dictionary, log.constants.debug);

        if(test.assertion.notEmpty$Object(columnNamesAndTypes$Dictionary))
        {
            let columnNames$ArrayString = Object.keys(columnNamesAndTypes$Dictionary);
            log.value.write("columnNames$ArrayString", columnNames$ArrayString, log.constants.debug);

            let columnNamesAndTypes$String = '(';
            for(let columnName$String of columnNames$ArrayString)
            {
                columnNamesAndTypes$String += "`" + columnName$String + "`" + " " + columnNamesAndTypes$Dictionary[columnName$String];
                columnNamesAndTypes$String += ', ';
            }
            columnNamesAndTypes$String = columnNamesAndTypes$String.slice(0, -2);
            columnNamesAndTypes$String += ')';
            log.comment.write("Column names and types: " + columnNamesAndTypes$String, log.constants.debug);

            let sql$String = "USE ??; ";
            sql$String += "CREATE TABLE IF NOT EXISTS ?? " + columnNamesAndTypes$String;

            let sqlParameters$Array = [
                databaseName$String,
                tableName$String,
            ];

            log.comment.write("SQL: " + sql$String, log.constants.debug);

            global.pool$DatabaseConnectionPool.query(
                sql$String,
                sqlParameters$Array,
                function(e$Error, results$Unknown)
                {
                    log.value.write("e$Error", e$Error, log.constants.debug);
                    log.value.write("results$Unknown", results$Unknown, log.constants.debug);
                }
            )
        }
        else
        {

        }
    }

};

module.exports = createFunctions;