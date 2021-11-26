"use strict";

const account   = require('../account');
const form      = require('.');
const globals   = require('../globals');
const grammar   = require('../grammar');
const html      = require('../html');
const log       = require('../log');
const path      = require('../path');
const test      = require('../test');
const text      = require('../text');
const value     = require('../value');

let accountFormFunctions = {

    create(request$ExpressRequestDictionary)
    {
        let html$String = '';
        let fields$String = '';

        fields$String += text.merge.template
        (
            form.template.element.field_text_00001,
            {
                $html_id            : value.convert.toHTMLIDFromString(form.constants.create.accountname_field),
                $label_text         : globals.text(globals.localization.form.account_name, globals.language.get(request$ExpressRequestDictionary)),
                $label_css_class    : form.template.element.label_css_class,
                $field_css_class    : form.template.element.field_css_class,
                $field_css_size     : form.template.element.field_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : ''
            }
        );

        fields$String += text.merge.template
        (
            form.template.element.field_password_00001,
            {
                $html_id            : value.convert.toHTMLIDFromString(form.constants.create.password_field),
                $label_text         : globals.text(globals.localization.form.password, globals.language.get(request$ExpressRequestDictionary)),
                $label_css_class    : form.template.element.label_css_class,
                $field_css_class    : form.template.element.field_css_class,
                $field_css_size     : form.template.element.field_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : ''
            }
        );

        let htmlButton$String = text.merge.template(form.template.element.button_submit_00001,
            {
                $html_id                    : value.convert.toHTMLIDFromString(globals.text(globals.localization.form.submit_button, globals.language.get(request$ExpressRequestDictionary))),
                $button_submit_css_class    : form.template.element.button_submit_css_class,
                $label_text                 : globals.text(globals.localization.form.submit_button, globals.language.get(request$ExpressRequestDictionary)),
                $optional                   : form.template.element.button_submit_style_attibute_00002,
            });

        let form$String = text.merge.template(
            form.template.web.form_type_00001_post,
            {
                $form_css_class     : form.template.web.form_css_class,
                $value              : fields$String,
                $button             : htmlButton$String
            }
        );

        html$String = form.template.web.style_medium_width + form$String;

        return html$String;
    },

    login(request$ExpressRequestDictionary = {})
    {
        let html$String = '';
        let fields$String = '';

        log.comment.write("If request is not empty, then be sure to redirect user to the page in the request after login", log.constants.debug);

        let returnURL$String = '';
        let postURL$String = '';
        if (test.value.notEmpty$Dictionary(request$ExpressRequestDictionary))
        {

            returnURL$String = path.functions.url(request$ExpressRequestDictionary);
            // request$ExpressRequestDictionary.protocol + '://' + request$ExpressRequestDictionary.get('host') + request$ExpressRequestDictionary.originalUrl;
            request$ExpressRequestDictionary.session[account.constants.session.return_url] = returnURL$String;
            log.value.write("returnURL$String: redirect to this URL after logging in", returnURL$String, log.constants.debug);
            log.value.write("request$ExpressRequestDictionary.session[account.constants.session.return_url]", request$ExpressRequestDictionary.session[account.constants.session.return_url], log.constants.debug);

            postURL$String = request$ExpressRequestDictionary.protocol + '://' + request$ExpressRequestDictionary.get('host') + path.constants.route.account + path.constants.route.login;
        }

        // todo: add URL where to post to

        fields$String += text.merge.template
        (
            form.template.element.field_text_00001,
            {
                $html_id            : value.convert.toHTMLIDFromString(form.constants.login.accountname_field),
                $label_text         : globals.text(globals.localization.form.account_name, globals.language.get(request$ExpressRequestDictionary)),
                $label_css_class    : form.template.element.label_css_class,
                $field_css_class    : form.template.element.field_css_class,
                $field_css_size     : form.template.element.field_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : ''
            }
        );

        fields$String += text.merge.template
        (
            form.template.element.field_password_00001,
            {
                $html_id            : value.convert.toHTMLIDFromString(form.constants.login.password_field),
                $label_text         : globals.text(globals.localization.form.password, globals.language.get(request$ExpressRequestDictionary)),
                $label_css_class    : form.template.element.label_css_class,
                $field_css_class    : form.template.element.field_css_class,
                $field_css_size     : form.template.element.field_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : ''
            }
        );

        let htmlButton$String = text.merge.template(form.template.element.button_submit_00001,
            {
                $html_id                    : value.convert.toHTMLIDFromString(globals.text(globals.localization.form.submit_button, globals.language.get(request$ExpressRequestDictionary))),
                $button_submit_css_class    : form.template.element.button_submit_css_class,
                $label_text                 : globals.text(globals.localization.form.submit_button, globals.language.get(request$ExpressRequestDictionary)),
                $optional                   : form.template.element.button_submit_style_attibute_00002,
            });

        let form$String = text.merge.template(
            form.template.web.form_type_00001_post,
            {
                $form_css_class     : form.template.web.form_css_class,
                $value              : fields$String,
                $button             : htmlButton$String,
                $optional           : (test.value.notEmpty$String(returnURL$String))
                    ? "action='" + postURL$String + "'"
                    : ''
            }
        );

        html$String = form.template.web.style_medium_width + form$String;

        return html$String;
    },

    password(request$ExpressRequestDictionary)
    {
        let html$String = '';
        let fields$String = '';

        fields$String += text.merge.template
        (
            form.template.element.field_text_00001,
            {
                $html_id            : value.convert.toHTMLIDFromString(form.constants.login.accountname_field),
                $label_text         : globals.text(globals.localization.form.account_name, globals.language.get(request$ExpressRequestDictionary)),
                $label_css_class    : form.template.element.label_css_class,
                $field_css_class    : form.template.element.field_css_class,
                $field_css_size     : form.template.element.field_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : ''
            }
        );

        fields$String += text.merge.template
        (
            form.template.element.field_text_00001,
            {
                $html_id            : value.convert.toHTMLIDFromString(form.constants.change_password.password_field),
                $label_text         : globals.text(globals.localization.form.password, globals.language.get(request$ExpressRequestDictionary)),
                $label_css_class    : form.template.element.label_css_class,
                $field_css_class    : form.template.element.field_css_class,
                $field_css_size     : form.template.element.field_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : ''
            }
        );

        fields$String += text.merge.template
        (
            form.template.element.field_password_00001,
            {
                $html_id            : value.convert.toHTMLIDFromString(form.constants.change_password.new_password_field),
                $label_text         : globals.text(globals.localization.form.new_password, globals.language.get(request$ExpressRequestDictionary)),
                $label_css_class    : form.template.element.label_css_class,
                $field_css_class    : form.template.element.field_css_class,
                $field_css_size     : form.template.element.field_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : ''
            }
        );

        let htmlButton$String = text.merge.template(form.template.element.button_submit_00001,
            {
                $html_id                    : value.convert.toHTMLIDFromString(globals.text(globals.localization.form.submit_button, globals.language.get(request$ExpressRequestDictionary))),
                $button_submit_css_class    : form.template.element.button_submit_css_class,
                $label_text                 : globals.text(globals.localization.form.submit_button, globals.language.get(request$ExpressRequestDictionary)),
                $optional                   : form.template.element.button_submit_style_attibute_00002,
            });

        let form$String = text.merge.template(
            form.template.web.form_type_00001_post,
            {
                $form_css_class     : form.template.web.form_css_class,
                $value              : fields$String,
                $button             : htmlButton$String
            }
        );

        html$String = form.template.web.style_medium_width + form$String;

        return html$String;
    },

};

module.exports = accountFormFunctions;