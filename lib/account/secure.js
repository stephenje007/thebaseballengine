"use strict";

const database   = require('../database');
const log        = require('../log');
const test       = require('../test');
const crypto     = require('crypto');

module.exports = {

    hashTextSimply(text$String)
    {
        let hash$Integer = 5381;
        let i = text$String.length;

        while(i) {
            hash$Integer = (hash$Integer * 33) ^ text$String.charCodeAt(--i);
        }

        /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
         * integers. Since we want the results to be always positive, convert the
         * signed int to an unsigned by doing an unsigned bitshift. */
        return hash$Integer >>> 0;
    },

    hashPassword(password$String, salt$String)
    {
        return new Promise( (resolve$Function, reject$Function) => {
            crypto.pbkdf2(password$String, salt$String, 100000, 64, 'sha512',
                (error$Error, key$Buffer) =>
                {
                    error$Error ? reject$Function(error$Error) : resolve$Function(key$Buffer.toString('hex'));
                });
        });
    },

    generateSalt()
    {
        let salt$String = Math.round((Math.random() * database.constants.master.salt_number)).toString();
        return salt$String;
    },

    generateAccountID()
    {
        return new Date().getTime().toString() + Math.round((Math.random() * 100)).toString();
    },

    obfuscatedAccountID(accountID$String)
    {
        return this.hashTextSimply(accountID$String);
    },

};