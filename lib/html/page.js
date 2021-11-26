"use strict";

const globals   = require('../globals');
const grammar   = require('../grammar');
const html      = require('../html');
const log       = require('../log');
const path      = require('../path');
const test      = require('../test');
const text      = require('../text');

let pageFunctions = {

    wrapInDashboardPage(title$String, incomingHTML$String, displayMenu$Boolean = false, request$ExpressRequestDictionary, pageTemplate$String = html.template.page.page_type_00001)
    {
        log.function.write("Wrapping HTML string in page template");

        let html$String = '';

        log.value.write("incomingHTML$String", incomingHTML$String, log.constants.debug);
        log.comment.write("Add title and menu to incomingHTML$String", log.constants.debug);

        let menuHTML$String = '';
        if (displayMenu$Boolean)
        {
            let linksHTML$String = '';
            linksHTML$String = text.merge.template(
                html.template.menu.menu_link_00001,
                {
                    $url: path.constants.getRouteName(path.constants.actions.insert),
                    $link_text: globals.text(globals.localization.dashboard.menu_insert, globals.language.get(request$ExpressRequestDictionary))
                }
            );

            menuHTML$String = text.merge.template(
                html.template.menu.menu_type_00001,
                {
                    $class_names: html.template.menu.menu_css_class,
                    $value: linksHTML$String
                }
            );
            menuHTML$String = html.template.menu.style_00001 + menuHTML$String;
        }
        let headerHTML$String = html.components.header(title$String);

        html$String += text.merge.template
        (
            pageTemplate$String,
            {
                $style  : html.template.page.page_style_00001,
                $title  : title$String,
                $class  : html.template.page.page_css_class,
                $body   : headerHTML$String + menuHTML$String + incomingHTML$String
            }
        );

        return html$String;
    },

    render(response, title$String, html$ArrayPromise, request$ExpressRequestDictionary, displayMenu$Boolean = false)
    {
        if (test.assertion.notEmpty$Array(html$ArrayPromise))
        {
            let html$String = '';
            Promise.all(html$ArrayPromise).then(
                (returnedHTML$ArrayString) =>
                {
                    for (let returnedHTML$String of returnedHTML$ArrayString)
                    {
                        html$String += returnedHTML$String;
                    }
                    return html$String;
                }
            ).finally(
                () =>
                {
                    html$String = this.wrapInDashboardPage(title$String, html$String, displayMenu$Boolean, request$ExpressRequestDictionary);
                    response.send(html$String);
                }
            );

        }
    }

};

module.exports = pageFunctions;