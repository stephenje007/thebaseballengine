"use strict";

const html = require('.');
const text = require('../text');

let componentFunctions = {

    box(text$String, style$StringWithHTMLAndCSS = html.template.box.style_00001)
    {
        let html$String = text$String;
        html$String = text.merge.template(
            html.template.box.box_type_00001,
            {
                "$class_names": html.template.box.box_css_class,
                "$value": html$String
            }
        );
        html$String = style$StringWithHTMLAndCSS + html$String;
        return html$String;
    },

    bubble(text$String, style$StringWithHTMLAndCSS = html.template.bubble.style_00001)
    {
        let html$String = text$String;
        html$String = text.merge.template(
            html.template.bubble.bubble_type_00001,
            {
                "$class_names": html.template.bubble.bubble_css_class,
                "$value": html$String
            }
        );
        html$String = style$StringWithHTMLAndCSS + html$String;
        return html$String;
    },

    header(text$String, style$StringWithHTMLAndCSS = html.template.header.style_00001)
    {
        let html$String = text$String;

        html$String = text.merge.template(
            html.template.header.header_type_00001,
            {
                "$class_names": html.template.menu.menu_css_class,
                "$value": html$String
            }
        );
        html$String = style$StringWithHTMLAndCSS + html$String;
        return html$String;
    }
};

module.exports = componentFunctions;