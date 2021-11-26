"use strict";

const database = require('../database');
const log = require('../log');

let infoFunctions = {

    async id (accountName$String)
    {
        log.function.write("Getting account ID", log.constants.debug);

        let sql$String = 'SELECT ?? FROM ?? WHERE ?? = ? LIMIT 1;';
        return await global.pool$DatabaseConnectionPool.runScriptToReturnOneAnswer
        (
            database.constants.master.database_name,
            sql$String,
            [
                'accountID',
                database.constants.master.account_table,
                'uniqueName',
                accountName$String
            ]
        );
    }

};

module.exports = infoFunctions;