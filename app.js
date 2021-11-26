"use strict";

const globals = require('./lib/globals');
const log = require('./lib/log');
const path = require('./lib/path');
const test = require('./lib/test');
const database = require('./lib/database');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3500;

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

global.currentLanguage$String = globals.constants.vocabulary.english;

new database.connection.DatabaseConnectionPool().createConnectionPool()
    .then(
        (pool$DatabaseConnectionPool) =>
        {
            global.pool$DatabaseConnectionPool = pool$DatabaseConnectionPool;
            new database.connection.DatabaseConnectionPool().createConnectionPool()
                .then(
                    (sessions$DatabaseConnectionPool) =>
                    {
                        log.value.write('Successfully added connection pool as global.pool$DatabaseConnectionPool', global.pool$DatabaseConnectionPool, log.constants.debug);

                        global.sessions$DatabaseConnectionPool = sessions$DatabaseConnectionPool;
                        let sessionStore = new MySQLStore({}, global.sessions$DatabaseConnectionPool.direct);

                        let publicPath$String = __dirname + path.constants.route.public;
                        log.value.write("publicPath$String", publicPath$String, log.constants.debug);

                        app.use(path.constants.route.public, express.static(publicPath$String));
                        app.use(session({
                            key: 'session_cookie_name',
                            secret: 'session_cookie_secret',
                            store: sessionStore,
                            resave: false,
                            saveUninitialized: false
                        }));
                        log.comment.write("Session initialized", log.constants.debug);

                        app.use(path.constants.route.home, path.dashboard());
                        app.listen(port, () => log.comment.write(`App listening on port ${port}!`));
                    }
                );
        }
    );


