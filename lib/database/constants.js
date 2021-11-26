"use strict";

let settings =
    {
        "connections": 30,
        "ipAddress": "localhost",
        "user": "root",
        "password": "[your password]",
        "port": "3306",
        "database": "_synergy-25"
    };

module.exports.settings = settings;

let master =
    {
        database_name   : "_synergy-25",
        account_table   : "_Accounts",
        salt_number     : 4985534098423,
    };

module.exports.master = master;

let prefix =
    {
        user_database       : "__user_",
        user_cms_database   : "__user_cms_"
    };

module.exports.prefix = prefix;

let identifiers =
    {
        internal_row                : "_id1",
        html_id_space_replacement   : ".",
        datalist_separator          : "|"
    };

module.exports.identifiers = identifiers;
