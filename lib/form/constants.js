"use strict";

let ask = {
    query_field_id: "question",
    button_submit_id: "submit"
}; module.exports.ask = ask;

let type = {
    query       : "query",
    insert      : "insert",
    edit        : "edit",
}; module.exports.type = type;

let change_password = {
    password_field       : "oldpassword",
    new_password_field   : "newpassword",
}; module.exports.change_password = change_password;

let create = {
    accountname_field    : "account",
    password_field       : "password"
}; module.exports.create = create;

let login = {
    accountname_field    : "account",
    password_field       : "password"
}; module.exports.login = login;

