"use strict";

const database = require('.');
const log = require('../log');
const test = require('../test');
const value = require('../value');

const fs = require('fs');
const mysql = require('mysql');

class DatabaseConnectionPool
{
    constructor()
    {

    }

    async createConnectionPool()
    {
        log.function.write("Creating database connection pool", log.constants.debug);

        let ipAddress = '0.0.0.0';
        require('dns').lookup(require('os').hostname(), function (err, address, fam)
        {
            ipAddress = address;
            log.comment.write('IP Address: ' + address, log.constants.debug);
        });

        let connectionPool$MySQLPool;
        if (false && ipAddress === "127.0.0.1")
        {
            connectionPool$MySQLPool = mysql.createConnection(
            {
                connectionLimit: database.constants.settings.connections,
                host: "127.0.0.1",
                user: database.constants.settings.user,
                port: '/var/run/mysqld/mysqld.sock',
                password: database.constants.settings.password,
            });
        }
        else
        {
            connectionPool$MySQLPool = mysql.createPool(
                {
                    connectionLimit: database.constants.settings.connections,
                    host: database.constants.settings.ipAddress,
                    user: database.constants.settings.user,
                    port: database.constants.settings.port,
                    password: database.constants.settings.password,
                    database: database.constants.settings.database,
        //            "connectTimeout": 30000,
	//		"acquireTimeout": 30000,
			multipleStatements: true,
                    supportBigNumbers: true,
        //            ssl:
         //               {
          //                  ca: fs.readFileSync(__dirname + '/.ignore/ca.pem'),
           //                 key: fs.readFileSync(__dirname + '/.ignore/client-key.pem'),
            //                cert: fs.readFileSync(__dirname + '/.ignore/client-cert.pem'),
//			rejectUnauthorized: false
 //                       }
                });
        }

        this._connectionPool$MySQLPool = await connectionPool$MySQLPool;
        this.direct = this._connectionPool$MySQLPool;
        return this;
    };

    runUpdateScript(databaseName$String, tableName$String, sqlParameters$ArrayString = [], whereCondition$String = '1 != 1')
    {
        log.function.write("Update the database using the incoming parameters", log.constants.debug);
        log.value.write("databaseName$String", databaseName$String, log.constants.debug);
        log.value.write("tableName$String", tableName$String, log.constants.debug);
        log.value.write("sqlParameters$ArrayString", sqlParameters$ArrayString, log.constants.debug);
        log.value.write("whereCondition$String", whereCondition$String, log.constants.debug);

        let sql$String = '';
        //sql$String += 'USE `' + databaseName$String + '`; ';
        sql$String += 'UPDATE `' + databaseName$String + '`.`' + tableName$String + '` ';
        sql$String += 'SET ';

        if (test.assertion.notEmpty$Array(sqlParameters$ArrayString))
        {
            for (let i = 0; i < sqlParameters$ArrayString.length; i++)
            {
                if (i < sqlParameters$ArrayString.length - 1)
                {
                    sql$String += "`" + sqlParameters$ArrayString[i] + "` = '" + sqlParameters$ArrayString[++i] + "' ";
                    if (i < sqlParameters$ArrayString.length - 1) sql$String += ', ';
                }
            }
            sql$String += 'WHERE ' + whereCondition$String + ';';
            return this.runScriptWithoutSubstitutions(databaseName$String, sql$String);
        }
        return null;
    }

    runScriptToReturnOneAnswer(databaseName$String, sql$String, sqlParameters$ArrayString = [])
    {
        log.function.write("Queries the database and parses the result to return a single value", log.constants.debug);
        return this.runScript(databaseName$String, sql$String, sqlParameters$ArrayString)
            .then(
                (result$ArrayDictionary) =>
                {
                    log.value.write("Received result from database result$ArrayDictionary", result$ArrayDictionary, log.constants.debug);

                    let result$StringOrNumber = value.convert.toValueFromArrayDictionary(result$ArrayDictionary);
                    log.value.write("Converted result to result$StringOrNumber", result$StringOrNumber, log.constants.debug);

                    return result$StringOrNumber;
                }
            )

    }

    runScriptWithoutSubstitutions(databaseName$String, sql$String)
    {
        log.function.write("Only use this function if all the SQL parameters are vetted or none are user-supplied", log.constants.debug);
        return this.runScript(databaseName$String, sql$String);
    }

    runScript(databaseName$String, sql$String, sqlParameters$ArrayString = [])
    {
        // todo: handle empty sqlParameters$ArrayString
        // todo: support transactions (e.g. connection.rollback, connection.commit)

        log.function.write("Running SQL script", log.constants.debug);
        log.value.write("sql$String: SQL command to passed to runScript", sql$String, log.constants.debug);
        log.value.write("sqlParameters$ArrayString: SQL parameters", sqlParameters$ArrayString, log.constants.debug);

        sql$String = ' USE `' + databaseName$String + '`; ' + sql$String;
        sql$String += ' USE `' + database.constants.master.database_name + '`; ';
        log.value.write("sql$String: SQL command to run", sql$String, log.constants.debug);

        return new Promise(
            (resolve$Function, reject$Function) =>
            {
                this._connectionPool$MySQLPool.query(
                    //databaseName$String,
                    sql$String,
                    sqlParameters$ArrayString,
                    function (error$Error, resultContainingOkPacket$ArrayJson)
                    {
                        log.value.write("SQL: ", sql$String, log.constants.debug);
                        log.value.write("Parameters: ", sqlParameters$ArrayString, log.constants.debug);

                        if(error$Error)
                        {
                            log.value.write("There has been an error: ", error$Error);
                            return reject$Function("There has been an error"); // Todo: Replace this with query error
                        }
                        else
                        {
                            if(test.assertion.inBounds$Array(resultContainingOkPacket$ArrayJson, 1))
                            {
                                // Format of resultContainingOkPacket$ArrayJson:
                                // [ OkPacket {
                                //     fieldCount: 0,
                                //     affectedRows: 0,
                                //     insertId: 0,
                                //     serverStatus: 10,
                                //     warningCount: 0,
                                //     message: '',
                                //     protocol41: true,
                                //     changedRows: 0 },
                                // [ RowDataPacket { accountID: '<data>' } ] ]

                                let result$ArrayDictionary = value.convert.toArrayDictionaryFromArrayArrayDictionaryOkPacket(resultContainingOkPacket$ArrayJson);

                                log.value.write("resultContainingOkPacket$ArrayJson", resultContainingOkPacket$ArrayJson, log.constants.debug);
                                log.value.write("result$ArrayDictionary", result$ArrayDictionary, log.constants.debug);

                                    log.function.return("Returning from DatabaseConnectionPool.runScript", result$ArrayDictionary, log.constants.debug);
                                    return resolve$Function(result$ArrayDictionary);
                            }
                            else
                            {
                                log.comment.write("Promise rejected", log.constants.debug);
                                return reject$Function(resultContainingOkPacket$ArrayJson);
                            }
                        }
                    }
                );
            }
        );
    }
}

module.exports.DatabaseConnectionPool = DatabaseConnectionPool;
