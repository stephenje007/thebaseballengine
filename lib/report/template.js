"use strict";

const html = require('../html');

let constant = {

    report_container_prefix     : "report_",
    report_header_cell_prefix   : "reportheader_",
    report_cell_prefix          : "reportcell_",

    record_container_prefix     : "record_",
    record_header_prefix        : "recordheader_",
    record_cell_prefix          : "recordcell_",

}; module.exports.constant = constant;

let record = {

    record_type_00001       : "<div class='|$class_names|'>|$value|</div>",
    record_css_class        : this.constant.record_container_prefix + "00001",

    header_00001            : "<div class='|$class_names|'>|$value|</div>",
    header_css_class        : this.constant.record_header_prefix + "00001",

    cell_00001              : "<div class='|$class_names|'>|$value|</div>",
    cell_css_class          : this.constant.record_cell_prefix + "00001",

    link_edit_00001         : "<a href='|$url|/|$row_id|'>|$link_text|</a>",
    style_00001:
        `
<style>
    div[class^='${this.constant.record_container_prefix}']
    {
        display:                inline-grid;
        margin:                 auto;
        width:                  auto;
        max-width:              100%;
        row-gap:                10px;
        column-gap:             20px;
        word-wrap:              break-word;
        font-family:            ${html.template.global_style_00001.font_family};
    }
    div[class^='${this.constant.record_header_prefix}']
    {
        font-weight: bold;
    }
</style>
`,
}; module.exports.record = record;

let web = {
    report_type_00001       : "<div class='|$class_names|'>|$value|</div>",
    report_css_class        : this.constant.report_container_prefix + "00001",
    report_cell_css_class   : this.constant.report_cell_prefix + "00001",
    header_cell_00001       : "<div class='|$class_names|'>|$value|</div>",
    header_cell_css_class   : this.constant.report_header_cell_prefix + "00001",
    cell_00001              : "<div class='|$class_names|'>|$value|</div>",
    style_00001:
        `
<style>
div[class^='${this.constant.report_container_prefix}']
{
    display:                inline-grid;
    row-gap:                20px;
    column-gap:             20px;
    grid-template-columns:  repeat(|$value|, auto);
    font-family:            ${html.template.global_style_00001.font_family};
    font-size:              0.9em;
}
div[class^='${this.constant.report_header_cell_prefix}']
{
    grid-template-columns:  repeat(|$value|, auto);
    font-weight: bold;
}
</style>
`
}; module.exports.web = web;

