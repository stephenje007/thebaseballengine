"use strict";

const account   = require('.');
const database  = require('../database');
const log       = require('../log');
const test      = require('../test');

let authenticationFunctions = {

    async accountAndPassword(accountName$String, password$String, request$ExpressRequestDictionary = {})
    {
        let result$BooleanOrString = '';

        // todo: check disallowed characters, minimum password length

        let sql$String = '';
        //'USE `' + database.constants.master.database_name + '`; ';
        sql$String += 'SELECT ??, ?? FROM `' + database.constants.master.database_name + '`.`' + database.constants.master.account_table + '` ';
        sql$String += "WHERE `uniqueName` = '" + accountName$String + "'; ";

        log.value.write("sql$String", sql$String, log.constants.debug);

        let result$ArrayDictionary = await global.pool$DatabaseConnectionPool.runScript(
            database.constants.master.database_name,
            sql$String,
            ['passwordHash', 'passwordSalt']
        );

        if (test.value.notEmpty$Array(result$ArrayDictionary))
        {
            if (test.assertion.hasKey(result$ArrayDictionary[0], "passwordHash") && test.assertion.hasKey(result$ArrayDictionary[0], "passwordSalt"))
            {
                let passwordHash$String = result$ArrayDictionary[0]["passwordHash"];
                let passwordSalt$String = result$ArrayDictionary[0]["passwordSalt"];
                let hashedPassword$String = await account.secure.hashPassword(password$String, passwordSalt$String);

                log.value.write("Looking for passwordHash, passwordSalt", result$ArrayDictionary, log.constants.debug);
                log.value.write("hashedPassword$String", hashedPassword$String, log.constants.debug);

                if (test.value.equal$String(passwordHash$String, hashedPassword$String))
                {
                    result$BooleanOrString = true;
                    if (test.value.notEmpty$Dictionary(request$ExpressRequestDictionary))
                    {
                        request$ExpressRequestDictionary.session.accountName$String = accountName$String;
                        log.value.write("request$ExpressRequestDictionary.session", request$ExpressRequestDictionary.session, log.constants.debug);
                    }
                    // todo: test assign session
                }
                else
                {
                    result$BooleanOrString = "Error message";
                }
            }
        }

        log.function.return("Returning result$BooleanOrString from accountAndPassword", result$BooleanOrString, log.constants.debug);
        return result$BooleanOrString;
    },

    async newPassword(accountName$String, oldPassword$String, newPassword$String)
    {
        let result$BooleanOrString = '';
        let oldLoginInformationCorrect$BooleanOrString = await this.accountAndPassword(accountName$String, oldPassword$String);

        log.value.write("oldLoginInformationCorrect$BooleanOrString", oldLoginInformationCorrect$BooleanOrString, log.constants.debug);
        if (test.value.trueNotErrorMessage(oldLoginInformationCorrect$BooleanOrString))
        {
            log.comment.write("Old login information is correct. Changing password", log.constants.debug);
            let databaseName$String = database.constants.master.database_name;
            let tableName$String = database.constants.master.account_table;
            let passwordSalt$String = account.secure.generateSalt();
            let passwordHash$String = await account.secure.hashPassword(newPassword$String, passwordSalt$String);
            let sqlParameters$ArrayString = [
                'passwordHash', passwordHash$String,
                'passwordSalt', passwordSalt$String
            ];
            let whereCondition$String = "`uniqueName` = '" + accountName$String + "'";

            let result$ArrayDictionary = await global.pool$DatabaseConnectionPool.runUpdateScript(databaseName$String, tableName$String, sqlParameters$ArrayString, whereCondition$String);
            result$BooleanOrString = true;
            log.value.write("Password updated?", result$BooleanOrString, log.constants.debug);
        }
        else
        {
            result$BooleanOrString = oldLoginInformationCorrect$BooleanOrString
        }

        log.function.return("Returning result$BooleanOrString from newPassword", result$BooleanOrString, log.constants.debug);
        return result$BooleanOrString;
    },

    isLoggedIn(request$ExpressRequestDictionary)
    {
        let result$Boolean = false;

        if (test.value.hasKey(request$ExpressRequestDictionary.session, account.constants.session.account_name) &&
            test.value.notEmpty$String(request$ExpressRequestDictionary.session[account.constants.session.account_name]))
        {
            result$Boolean = true;
        }

        return result$Boolean;
    },

    getCurrentAccountName(request$ExpressRequestDictionary)
    {
        let result$String = '';
        if (this.isLoggedIn(request$ExpressRequestDictionary))
        {
            result$String = request$ExpressRequestDictionary.session[account.constants.session.account_name];
        }
        return result$String;
    },

    logout(request$ExpressRequestDictionary)
    {
        request$ExpressRequestDictionary.session.destroy();
    }

};

module.exports = authenticationFunctions;