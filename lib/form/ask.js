"use strict";

const form = require('../form');
const globals = require('../globals');
const html = require('../html');
const log = require('../log');
const test = require('../test');
const text = require('../text');
const value = require('../value');

let askFormFunctions = {

    generateHTML(request$ExpressRequestDictionary, query$String = '')
    {
        log.function.write("Creating form for asking questions", log.constants.debug);

        let html$String = '';

        if (test.value.notEmpty$String(query$String))
            query$String = value.convert.toHTMLEncoded(query$String);

        let css$String = form.template.web.style_00001;

        let elements$String = text.merge.template(
            form.template.element.field_text_00001,
            {
                $html_id            : form.constants.ask.query_field_id,
                $label_css_class    : form.template.element.label_css_class,
                $label_text         : globals.text(globals.localization.ask.label_question, globals.language.get(request$ExpressRequestDictionary)),
                $field_css_size     : form.template.element.field_ask_css_size,
                $field_maxlength    : form.template.element.field_maxlength,
                $default_value      : query$String
            },
        );

        elements$String += text.merge.template(
            form.template.element.button_submit_00001,
            {
                $html_id                 : form.constants.ask.button_submit_id,
                $label_text              : globals.text(globals.localization.ask.button_question, globals.language.get(request$ExpressRequestDictionary)),
                $button_submit_css_class : form.template.element.button_submit_css_class
            }
        );


        let form$String = text.merge.template(
            form.template.web.form_type_00001_get,
            {
                $form_css_class     : form.template.web.form_css_class,
                $value              : elements$String,
                // $button             : button$String
            },
        );

        html$String = css$String + form$String;

        return html$String;
    }

};

module.exports = askFormFunctions;