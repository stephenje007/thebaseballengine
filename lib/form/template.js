"use strict";

const html = require('../html');

let constant = {

    form_container_prefix       : "form_",

}; module.exports.constant = constant;


let web = {
    form_type_00001_post    : "<form method='POST' |$optional|><div class='|$form_css_class|'>|$value|</div>|$button|</form>",
    form_type_00001_get     : "<form method='GET' |$optional|><div class='|$form_css_class|'>|$value|</div>|$button|</form>",
    form_css_class          : this.constant.form_container_prefix + "00001",
    style_00001:
        `
<style>
    form > div[class^=${this.constant.form_container_prefix}]
    {
        margin:                 auto;
        font-family:            ${html.template.global_style_00001.font_family};
        display:                grid;
        align-items:            center;
        grid-auto-flow:         row;
        grid-gap:               .5em;
        background:             ${html.template.global_style_00001.background_color};
    }
    form > div > input,textarea /*,button*/
    {
        border:                 1px solid ${html.template.global_style_00001.border_color};
        font-size:              0.8em;
        padding:                0.5em;
        width:                  97.5%;
    }
    /*form > div > input*/
    /*{*/
    /*    width:                  98%*/
    /*}*/
    input[type="submit"] 
    {
        border:                 1px solid ${html.template.global_style_00001.border_color};
        font-size:              0.8em;
        padding:                0.5em;
        width:                  100%;
    }
    form > div[class^=${this.constant.form_container_prefix}]
    {
        /*grid-template-columns:  1fr;*/
        grid-gap:               0.5em;
        padding:                0.75em;
    }
</style>
`
}; module.exports.web = web;

let element = {

    field_text_00001          : "<label for='|$html_id|' class='|$label_css_class|'>|$label_text|</label><input type='text' id='|$html_id|' name='|$html_id|' class='|$field_css_class|' size='|$field_css_size|' maxlength='|$field_maxlength|' value='|$default_value|' |$optional| />",
    field_password_00001      : "<label for='|$html_id|' class='|$label_css_class|'>|$label_text|</label><input type='password' id='|$html_id|' name='|$html_id|' class='|$field_css_class|' size='|$field_css_size|' maxlength='|$field_maxlength|' value='|$default_value|' |$optional| />",
    field_css_class           : "field_00001",
    field_css_size            : 50,
    field_ask_css_size        : 80,
    field_maxlength           : 200,

    button_submit_00001                : "<label></label><input type='submit' id='|$html_id|' class='|$button_submit_css_class|' value='|$label_text|' |$optional| />",
    button_submit_css_class            : "button_submit_00001",
    button_submit_style_attibute_00002 : "style='margin-top: 1.0em;'",

    textarea_00001            : "<label for='|$html_id|' class='|$label_css_class|'>|$label_text|</label><textarea id='|$html_id|' name='|$html_id|' class='|$textarea_css_class|' rows='|$textarea_rows|' cols='|$textarea_columns|' maxlength='|$textarea_maxlength|' |$optional| >|$default_value|</textarea>",
    textarea_css_class        : "textarea_00001",
    textarea_rows             : 6,
    textarea_columns          : 50,
    textarea_maxlength        : 2000,

    datalist_00001            : "<datalist id='|$html_id|'>|$options|</datalist>",
    datalist_option_00001     : '<option value="|$value|">',

    label_css_class           : "label_00001",

}; module.exports.element = element;

