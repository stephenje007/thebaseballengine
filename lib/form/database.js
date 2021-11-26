"use strict";

const database   = require('../database');
const form       = require('.');
const globals    = require('../globals');
const grammar    = require('../grammar');
const html       = require('../html');
const log        = require('../log');
const test       = require('../test');
const text       = require('../text');
const value      = require('../value');

const htmlEncode = require('js-htmlencode');

let generateFormFunctions = {

    async fromTable(databaseName$String, tableName$String, request$ExpressRequestDictionary, params$Dictionary = {})
    {
        log.function.write("Generating form from database table", log.constants.debug);
        log.value.write("databaseName$String", databaseName$String, log.constants.debug);
        log.value.write("tableName$String", tableName$String, log.constants.debug);

        let formType$String = value.extract.valueFromDictionary(params$Dictionary, "formType$String", form.constants.type.insert);
        log.value.write("formType$String", formType$String, log.constants.debug);

        let defaultValues$Dictionary = value.extract.valueFromDictionary(params$Dictionary, "defaultValues$Dictionary", {});
        log.value.write("defaultValues$Dictionary", defaultValues$Dictionary, log.constants.debug);

        let showDatalists$Boolean = (test.value.hasKey(params$Dictionary, "showDatalists$Boolean"))
            ? params$Dictionary["showDatalists$Boolean"]
            : false;

        log.value.write("showDatalists$Boolean", showDatalists$Boolean, log.constants.debug);

        let rowID$Integer = (test.value.hasKey(params$Dictionary, "rowID$Integer"))
            ? (test.value.notEmpty$Integer(params$Dictionary["rowID$Integer"])) ? params$Dictionary["rowID$Integer"] : null
            : null;

        log.value.write("rowID$Integer", rowID$Integer, log.constants.debug);

        let result$String = '';
        let html$String = '';
        if (test.assertion.notEmpty$String(databaseName$String) && test.assertion.notEmpty$String(tableName$String))
        {
            let databaseColumnInfo$ArrayDictionary = await database.get.databaseTableColumns(databaseName$String, tableName$String);
            if (test.value.notEmpty$Array(databaseColumnInfo$ArrayDictionary))
            {
                if (test.value.notEmpty$Integer(rowID$Integer))
                {
                    // todo: prepopulate record into field forms
                }

                let datalists$Dictionary = {};
                if (showDatalists$Boolean)
                {
                    let columnsForDatalists$ArrayString = [];
                    for (let columnIndex$Integer = 0; columnIndex$Integer < databaseColumnInfo$ArrayDictionary.length; columnIndex$Integer++)
                    {
                        let currentFieldName$String = databaseColumnInfo$ArrayDictionary[columnIndex$Integer]['Field'];
                        columnsForDatalists$ArrayString.push(currentFieldName$String);
                    }
                    let sqlForDatalists$String = ''; //'USE `' + databaseName$String + '`; ';
                    sqlForDatalists$String += 'SELECT ';
                    for (let columnIndex$Integer = 0; columnIndex$Integer < columnsForDatalists$ArrayString.length; columnIndex$Integer++)
                    {
                        sqlForDatalists$String += '(SELECT group_concat(DISTINCT ';
                        sqlForDatalists$String += '`' + columnsForDatalists$ArrayString[columnIndex$Integer] +  '` ';
                        sqlForDatalists$String += 'SEPARATOR "' + database.constants.identifiers.datalist_separator + '") ';
                        sqlForDatalists$String += 'FROM ' + '`' + databaseName$String + '`.`' + tableName$String + '`) ';
                        sqlForDatalists$String += 'AS `' + value.convert.toHTMLIDFromString(columnsForDatalists$ArrayString[columnIndex$Integer]) + '`';
                        if (columnIndex$Integer < columnsForDatalists$ArrayString.length - 1) sqlForDatalists$String += ', ';
                    }
                    sqlForDatalists$String += ';';
                    log.value.write("sqlForDatalists$String", sqlForDatalists$String, log.constants.debug);

                    let datalists$ArrayDictionary = await pool$DatabaseConnectionPool.runScriptWithoutSubstitutions(databaseName$String, sqlForDatalists$String);
                    log.value.write("datalists$ArrayDictionary", datalists$ArrayDictionary, log.constants.debug);

                    if (test.assertion.numberOfItems$Array(datalists$ArrayDictionary) === 1)
                        datalists$Dictionary = datalists$ArrayDictionary[0];
                    log.value.write("datalists$Dictionary", datalists$Dictionary, log.constants.debug);

                }

                for (let i = 0; i < databaseColumnInfo$ArrayDictionary.length; i++)
                {
                    let fieldType$String = databaseColumnInfo$ArrayDictionary[i]['Type'];
                    let fieldName$String = databaseColumnInfo$ArrayDictionary[i]['Field'];
                    let fieldNameHTMLID$String = value.convert.toHTMLIDFromString(fieldName$String);

                    let datalistHTML$String = '';

                    if (test.value.contains$String(fieldType$String, 'varchar'))
                    {
                        if
                        (
                            test.value.notEmpty$Dictionary(datalists$Dictionary) &&
                            test.assertion.hasKey(datalists$Dictionary, value.convert.toHTMLIDFromString(fieldName$String))
                        )
                        {
                            if (test.value.notEmpty$Dictionary(datalists$Dictionary[fieldNameHTMLID$String]) && datalists$Dictionary[fieldNameHTMLID$String].length <= html.constants.size.datalist_string_length)
                            {
                                let options$ArrayString = datalists$Dictionary[fieldNameHTMLID$String].split(database.constants.identifiers.datalist_separator).filter( (element$String) => test.value.notEmpty$String(element$String));
                                let datalistOptionsHTML$String = '';
                                for (let optionIndex$Integer = 0; optionIndex$Integer < options$ArrayString.length; optionIndex$Integer++)
                                {
                                    datalistOptionsHTML$String += text.merge.template
                                    (
                                        form.template.element.datalist_option_00001,
                                        {
                                            $value: options$ArrayString[optionIndex$Integer]
                                        }
                                    );
                                    log.value.write("datalistOptionsHTML$String", datalistOptionsHTML$String, log.constants.debug);
                                }

                                datalistHTML$String = text.merge.template
                                (
                                    form.template.element.datalist_00001,
                                    {
                                        $html_id    : value.convert.toHTMLIDFromString(fieldName$String) + html.template.constant.list_suffix,
                                        $options    : datalistOptionsHTML$String
                                    }
                                );
                                log.value.write("datalistHTML$String", datalistHTML$String, log.constants.debug);
                            }
                        }

                        let fieldHTML$String = text.merge.template(form.template.element.field_text_00001,
                            {
                                $html_id            : fieldNameHTMLID$String,
                                $label_text         : fieldName$String,
                                $label_css_class    : form.template.element.label_css_class,
                                $field_css_class    : form.template.element.field_css_class,
                                $field_css_size     : form.template.element.field_css_size,
                                $field_maxlength    : this._getVarcharFieldLength(fieldType$String),
                                $default_value      : value.extract.valueFromDictionary(defaultValues$Dictionary, fieldNameHTMLID$String, ''),
                                $optional           : (test.value.notEmpty$String(datalistHTML$String))
                                    ? "list='" + fieldNameHTMLID$String + html.template.constant.list_suffix + "'"
                                    : ''
                            });
                        log.value.write("fieldHTML$String", fieldHTML$String, log.constants.debug);

                        html$String += fieldHTML$String;
                        log.value.write("html$String", html$String, log.constants.debug);

                    }
                    else if (test.value.contains$String(fieldType$String, 'text'))
                    {
                        datalistHTML$String += text.merge.template(form.template.element.textarea_00001,
                            {
                                $html_id                : fieldNameHTMLID$String,
                                $label_text             : fieldName$String,
                                $label_css_class        : form.template.element.label_css_class,
                                $textarea_css_class     : form.template.element.textarea_css_class,
                                $textarea_rows          : form.template.element.textarea_rows,
                                $textarea_columns       : form.template.element.textarea_columns,
                                $textarea_maxlength     : form.template.element.textarea_maxlength,
                                $default_value          : value.extract.valueFromDictionary(defaultValues$Dictionary, fieldNameHTMLID$String, ''),
                            });
                    }
                    else if (test.value.contains$String(fieldType$String, 'decimal'))
                    {
                        datalistHTML$String += text.merge.template(form.template.element.field_text_00001,
                            {
                                $html_id            : fieldNameHTMLID$String,
                                $label_text         : fieldName$String,
                                $label_css_class    : form.template.element.label_css_class,
                                $field_css_class    : form.template.element.field_css_class,
                                $field_css_size     : form.template.element.field_css_size,
                                $field_maxlength    : this._getDecimalFieldLength(fieldType$String),
                                $default_value      : value.extract.valueFromDictionary(defaultValues$Dictionary, fieldNameHTMLID$String, ''),
                            });
                    }
                    html$String += datalistHTML$String;
                }
            }

            let htmlButton$String = text.merge.template(form.template.element.button_submit_00001,
                {
                    $html_id                    : value.convert.toHTMLIDFromString(globals.text(globals.localization.form.submit_button, globals.language.get(request))),
                    $button_submit_css_class    : form.template.element.button_submit_css_class,
                    $label_text                 : globals.text(globals.localization.form.submit_button, globals.language.get(request$ExpressRequestDictionary)),
                    $optional                   : form.template.element.button_submit_style_attibute_00002,
                });

            html$String = text.merge.template(form.template.web.form_type_00001_post,
                {
                    $form_css_class     : form.template.web.form_css_class,
                    $value              : html$String,
                    $button             : htmlButton$String
                });

            html$String = form.template.web.style_00001 + html$String;

        }

        result$String = html$String;
        log.function.write("Returning result$String from form.database.fromTable", result$String, log.constants.debug);

        return result$String;

    },

    _getVarcharFieldLength(text$String)
    {
        log.function.write("Getting length of field for this varchar", log.constants.debug);
        log.value.write("text$String", text$String, log.constants.debug);

        let regex$RegExp = /\(([^)]+)\)/;
        let matches$ArrayString = regex$RegExp.exec(text$String);

        log.value.write("matches$ArrayString", matches$ArrayString, log.constants.debug);

        let result$Integer = form.template.element.field_maxlength; // default value

        if (test.value.numberOfItems$Array(matches$ArrayString) > 1)
        {
            if (test.assertion.is$Integer(parseInt(matches$ArrayString[1])))
            {
                result$Integer = parseInt(matches$ArrayString[1]);
            }
            else
            {
                result$Integer = null;
            }
        }

        log.function.return("Returning result$Integer from _getVarcharFieldLength", result$Integer, log.constants.debug);
        return result$Integer;
    },

    _getDecimalFieldLength(text$String)
    {
        log.function.write("Getting length of field for this varchar", log.constants.debug);
        log.value.write("text$String", text$String, log.constants.debug);

        let regex$RegExp = /\(([^)]+)\)/;
        let matches$ArrayString = regex$RegExp.exec(text$String);

        log.value.write("matches$ArrayString", matches$ArrayString, log.constants.debug);

        let result$Integer = form.template.element.field_maxlength; // default value

        if (test.value.numberOfItems$Array(matches$ArrayString) > 1)
        {
            let integerAndFractional$String = matches$ArrayString[1];
            let integerAndFractional$ArrayString = integerAndFractional$String.split(',');

            result$Integer =
                integerAndFractional$ArrayString.map( (element$String) => parseInt(element$String)).reduce( (currentSum$Integer, element$Integer) => currentSum$Integer + element$Integer);
        }

        log.function.return("Returning result$Integer from _getVarcharFieldLength", result$Integer, log.constants.debug);
        return result$Integer;
    }
};

module.exports.generate = generateFormFunctions;

