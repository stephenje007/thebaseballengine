"use strict";

const account    = require('../account');
const form       = require('../form');
const globals    = require('../globals');
const grammar    = require('../grammar');
const html       = require('../html');
const log        = require('../log');
const path       = require('.');
const test       = require('../test');

const util = require('util');

const express = require('express');
const router = express.Router();

module.exports = function()
{
    router.get(path.constants.actions.create,

        function(request, response)
        {
            let html$ArrayPromise = [];
            html$ArrayPromise.push(html.components.bubble(form.account.create()));
            html.page.render(response, "", html$ArrayPromise, false);
        }
    );

    router.get(path.constants.actions.login,

        function(request, response)
        {
            let html$ArrayPromise = [];
            html$ArrayPromise.push(html.components.bubble(form.account.login()));
            html.page.render(response, "", html$ArrayPromise, false);
        }
    );

    router.get(path.constants.actions.logout,

        function(request, response)
        {
            let html$ArrayPromise = [];
            account.authenticate.logout(request);
            html$ArrayPromise.push(html.components.bubble(globals.text(globals.localization.authentication.logged_out, request.session[grammar.constants.database.language_variable])));
            html.page.render(response, "", html$ArrayPromise, false);
        }
    );

    router.get(path.constants.actions.password,

        function(request, response)
        {
            let html$ArrayPromise = [];
            html$ArrayPromise.push(html.components.bubble(form.account.password()));
            html.page.render(response, "", html$ArrayPromise, false);
        }
    );

    router.post(path.constants.actions.create,

        function(request, response)
        {
            let html$ArrayPromise = [];
            html$ArrayPromise.push(html.components.bubble(form.account.create()));
            html.page.render(response, "", html$ArrayPromise, false);
        }
    );

    router.post(path.constants.actions.login,

        function(request, response)
        {
            let html$ArrayPromise = [];

            log.value.write("request.body", request.body, log.constants.debug);
            if (test.value.notEmpty$Dictionary(request.body))
            {
                account.authenticate.accountAndPassword
                (
                    request.body[form.constants.login.accountname_field],
                    request.body[form.constants.login.password_field],
                    request
                )
                    .then(
                        () =>
                        {
                            // todo: check redirect if successful
                            let returnURL$String = request.session[account.constants.session.return_url];
                            request.session[account.constants.session.return_url] = '';
                            response.redirect(returnURL$String);
                        }
                    );
            }
            else
            {
                html$ArrayPromise.push(html.components.bubble(form.account.login()));
            }
            html.page.render(response, "", html$ArrayPromise, false);
        }
    );

    router.post(path.constants.actions.password,

        function(request, response)
        {
            let html$ArrayPromise = [];

            log.value.write("request.body", request.body, log.constants.debug);
            if (test.value.notEmpty$Dictionary(request.body))
            {
                account.authenticate.newPassword(request.body[form.constants.login.accountname_field], request.body[form.constants.change_password.password_field], request.body[form.constants.change_password.new_password_field])
                    .then(
                        () =>
                        {
                            html$ArrayPromise.push(html.components.bubble(util.inspect(request.body)));
                        }
                    );
            }
            else
            {
                html$ArrayPromise.push(html.components.bubble(form.account.login()));
            }
            html.page.render(response, "", html$ArrayPromise, false);
        }
    );


    return router;
};