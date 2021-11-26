"use strict";

const test = require('../test');

let route =
{
    "home"          : "/",
    "account"       : "/account",
    "ask"           : "/ask",
    "dashboard"     : "/dashboard",
    "login"         : "/login",
    "logout"        : "/logout",
    "public"        : "/public",
    "upload"        : "/upload",
    "uploaded"      : "/uploaded",
}; module.exports.route = route;

let actions =
{
    "add"           : "/add",
    "create"        : "/create",
    "edit"          : "/edit",
    "insert"        : "/insert",
    "login"         : "/login",
    "logout"        : "/logout",
    "password"      : "/password",
    "query"         : "/query"
}; module.exports.actions = actions;

let files =
{
    "upload_location" : __dirname + "/../../lib/temp/",
}; module.exports.files = files;


let getRouteName = function(route$String)
{
    let result$String = '';

    if(test.assertion.notEmpty$String(route$String))
    {
        return route$String.substr(1);
    }

    return result$String;
};

module.exports.getRouteName = getRouteName;