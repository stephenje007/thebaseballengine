"use strict";

let constant = {

    page_container_prefix       : "page_",

    report_container_prefix     : "report_",
    report_header_cell_prefix   : "reportheader_",
    report_cell_prefix          : "reportcell_",

    box_container_prefix        : "box_",

    bubble_container_prefix     : "bubble_",

    list_suffix                 : "_list",

    record_container_prefix     : "record_",
    record_header_prefix        : "recordheader_",
    record_cell_prefix          : "recordcell_",

    menu_container_prefix       : "menu_",
    menu_link_prefix            : "menulink_",

}; module.exports.constant = constant;

let global_style_00001 = {

    font_family         : "Arial, Helvetica, sans-serif",
    background_color    : "white",
    border_color        : "#c1c1c1",

}; module.exports.global_style_00001 = global_style_00001;

let box = {
    box_type_00001  : "<div class='|$class_names| box-container'>|$value|</div>",
    box_css_class   : this.constant.box_container_prefix + "00001",
    style_00001  :
        `
<style>
.box-container {
    display: inline-grid;
    background: ${this.global_style_00001.background_color};
    border: 1px solid #a7a7a7;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    -webkit-box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
    /*font-size: 1.2rem;*/
    /*line-height: 1.3;*/
    max-width: 600px;
    margin: 0 auto 40px;
    /*max-width: max-content;*/
    padding: 15px;
    position: relative;
    max-height: 999999px; /* Prevent font resizing on Google Chrome */
}

.box-container p {
    margin-bottom: 10px;
}
.box-container p:last-of-type {
    margin-bottom: 0;
}
</style>
`

}; module.exports.box = box;

let bubble = {
    bubble_type_00001  : "<div class='|$class_names| bubble-container'>|$value|<div class='bubble-container-arrow'></div></div>",
    bubble_css_class   : this.constant.bubble_container_prefix + "00001",
    style_00001        :
        `
<style>
.bubble-container {
    display: inline-grid;
    background: ${this.global_style_00001.background_color};
    border: 1px solid #a7a7a7;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    -webkit-box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
    font-size: 1.2rem;
    line-height: 1.3;
    margin: 0 auto 40px;
    max-width: max-content;
    padding: 15px;
    position: relative;
    font-family:            ${this.global_style_00001.font_family};

}

.bubble-container p {
    margin-bottom: 10px;
}
.bubble-container p:last-of-type {
    margin-bottom: 0;
}

.bubble-container-arrow {
    border-left: 21px solid transparent;
    border-top: 20px solid rgba(0, 0, 0, 0.2);
    bottom: -25px;
    position: absolute;
    right: 15px;
}
.bubble-container-arrow::before {
    border-left: 23px solid transparent;
    border-top: 23px solid #a7a7a7;
    bottom: 2px;
    content: "";
    position: absolute;
    right: 5px;
}
.bubble-container-arrow::after {
    border-left: 21px solid transparent;
    border-top: 21px solid ${this.global_style_00001.background_color};
    bottom: 4px;
    content: "";
    position: absolute;
    right: 6px;
}
</style>
`,
}; module.exports.bubble = bubble;

let header = {

    header_type_00001       : "<h1>|$value|</h1>",
    style_00001 :
        `
<style>
    h1 {
        padding:        30px 0 10px 0;
        font-size:      1.5em;
        margin:         auto;
    }
</style>    
`

}; module.exports.header = header;


let menu = {

    menu_type_00001         : "<div class='|$class_names|'>|$value|</div>",
    menu_css_class          : this.constant.menu_container_prefix + "00001",
    menu_link_00001         : "<a href='|$url|'>|$link_text|</a>",
    style_00001 :
        `
<style> 
    div[class^='${this.constant.menu_container_prefix}'] {
        display:                inline-grid;
        row-gap:                20px;
        column-gap:             20px;
        margin:                 auto;
        padding:                0 0 20px 0;
        width:                  auto;
        grid-template-columns:  repeat(|$value|, auto);
        font-family:            ${this.global_style_00001.font_family};
    }
</style>
`,

}; module.exports.menu = menu;

let page = {

    page_css_class      : this.constant.page_container_prefix + "00001",
    page_type_00001:
        `    
<!DOCTYPE html PUBLIC 
'-//W3C//DTD XHTML 1.0 Strict//EN' 
'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
|$style|
<title>|$title|</title>
<!--<script src="/public/sheets/webix/webix.js" type="text/javascript"></script>-->
<!--<script src="/public/sheets/spreadsheet.js" type="text/javascript"></script>-->
<!-- -->
<!--<link rel="stylesheet" type="text/css" href="/public/sheets/webix/webix.css">-->
<!--<link rel="stylesheet" type="text/css" href="/public/sheets/spreadsheet.css">-->
</head>
<body>
<div class="|$class|">
|$body|
</div>
</body>
</html>
`,
    page_style_00001:
        `
<style> 
    p {
        margin: 0;
        padding: 0;
    }
    div[class^='${this.constant.page_container_prefix}'] {
        display:                grid;
        margin:                 auto;
        align-items:            center;
        grid-template-columns:  auto;
        font-family:            ${this.global_style_00001.font_family};
    }
</style>
`
}; module.exports.page = page;
