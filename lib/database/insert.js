"use strict";

const database  = require('.');
const log       = require('../log');
const test      = require('../test');
const value     = require('../value');

let insertFunctions = {

    usingJSONDictionary(databaseName$String, tableName$String, json$Dictionary)
    // Run a database insert using a JSON dictionary
    // json$ArrayDictionary: push json into single element array if needed; each item in array is one record
    {
        log.function.write("Insert into database using JSON data", log.constants.debug);

        let columnNames$ArrayString = Object.keys(json$Dictionary).map( (element$String) => value.convert.toStringFromHTMLID(element$String));
        log.value.write("columnNames$ArrayString", columnNames$ArrayString, log.constants.debug);

        let arrayForInsert$ArrayArray = [Object.values(json$Dictionary)];
        return this.usingArrays(databaseName$String, tableName$String, columnNames$ArrayString, arrayForInsert$ArrayArray);
    },

    usingArrays(databaseName$String, tableName$String, columnNames$ArrayString, arrayForInsert$ArrayArray)
    // Run a database insert using the native array of record arrays format
    // The record arrays are one-dimensional and contain values in the order of the column names array string
    {
        log.function.write("Inserting into database using arrays", log.constants.debug);

        let formattedColumnNames$String = ''; // todo
        for(let columnName$String of columnNames$ArrayString)
        {
            columnName$String = value.convert.toStringFromHTMLID(columnName$String);
            formattedColumnNames$String += "`" + columnName$String + "`, ";
        }
        formattedColumnNames$String = formattedColumnNames$String.slice(0, -2);

        let sql$String = "USE ??; ";
        sql$String += "INSERT INTO ?? (" + formattedColumnNames$String + ") ";
        sql$String += "VALUES ?;";
        sql$String += "SELECT LAST_INSERT_ID();";

        let sqlParameters$Array = [
            databaseName$String,
            tableName$String,
            arrayForInsert$ArrayArray
        ];

        return new Promise((resolve$Function, reject$Function) =>
            {
                // results$ArrayObjects looks like this:
                // [ OkPacket {
                //     fieldCount: 0,
                //     affectedRows: 0,
                //     insertId: 0,
                //     serverStatus: 10,
                //     warningCount: 0,
                //     message: '',
                //     protocol41: true,
                //     changedRows: 0 },
                //   OkPacket {
                //     fieldCount: 0,
                //     affectedRows: 1,
                //     insertId: 86,
                //     serverStatus: 10,
                //     warningCount: 0,
                //     message: '',
                //     protocol41: true,
                //     changedRows: 0 },
                //   [ RowDataPacket { 'LAST_INSERT_ID()': 86 } ] ]
                global.pool$DatabaseConnectionPool.direct.query(
                    sql$String,
                    sqlParameters$Array,
                    function(error$Error, results$ArrayObjects)
                    {
                        if(error$Error)
                        {
                        }
                        else
                        {
                            if(test.assertion.inBounds$Array(results$ArrayObjects, 2))
                            {
                                log.value.write("Result of insert", results$ArrayObjects, log.constants.debug);
                                let oneElementArrayContainingRowDataPacket$ArrayObjects = results$ArrayObjects[2];
                                if(test.assertion.notEmpty$Array(oneElementArrayContainingRowDataPacket$ArrayObjects))
                                {
                                    let result$KeyValuePair = oneElementArrayContainingRowDataPacket$ArrayObjects[0];
                                    if(test.assertion.notEmpty$Dictionary(result$KeyValuePair))
                                    {
                                        let result$Integer = value.extract.valueFromKeyValuePair(result$KeyValuePair);
                                        resolve$Function(result$Integer);
                                    }
                                }
                            }
                            reject$Function(results$ArrayObjects);
                        }
                    }

                );
            }
        );

    }


};

module.exports = insertFunctions;