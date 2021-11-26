"use strict";

const database  = require('../database');
const html      = require('../html');
const log       = require('../log');
const test      = require('../test');
const text      = require('../text');

let recordFunctions = {

    async fromDatabase(databaseName$String, tableName$String, recordID$Integer)
    {
        log.function.write("Create report from record in database", log.constants.debug);
        let result$String = '';

        log.value.write("databaseName$String", databaseName$String, log.constants.debug);
        log.value.write("tableName$String", tableName$String, log.constants.debug);
        log.value.write("recordID$Integer", recordID$Integer, log.constants.debug);

        let html$String = '';
        if
        (
            test.assertion.notEmpty$String(databaseName$String) &&
            test.assertion.notEmpty$String(tableName$String) &&
            test.assertion.notEmpty$Integer(recordID$Integer)
        )
        {

            let sql$String = '';
            //sql$String += 'USE `' + databaseName$String + "`; ";
            sql$String += 'SELECT * FROM ?? WHERE ?? = ? LIMIT 1;';

            let record$ArrayDictionary = await global.pool$DatabaseConnectionPool.runScript(
                databaseName$String,
                sql$String,
                [
                    tableName$String,
                    database.constants.identifiers.internal_row,
                    recordID$Integer
                ]
            );

            log.value.write("Got record record$ArrayDictionary from database", record$ArrayDictionary, log.constants.debug);
            if (test.value.notEmpty$Array(record$ArrayDictionary))
            {
                html$String = this.fromJSON(record$ArrayDictionary[0]);
            }
        }

        result$String = html$String;
        log.function.return("Returning result$String from fromDatabase", result$String, log.constants.debug);
        return result$String;
    },

    fromJSON(json$Dictionary)
    {
        log.function.write("Create report from JSON dictionary", log.constants.debug);
        log.value.write("json$Dictionary", json$Dictionary, log.constants.debug);

        let result$String = '';
        let html$String = '';

        if (test.assertion.notEmpty$Dictionary(json$Dictionary))
        {
            let record$String = '';
            for (let key$String in json$Dictionary)
            {
                if (!test.value.equal$String(key$String, database.constants.identifiers.internal_row))
                {
                    record$String += text.merge.template(
                        report.template.record.header_00001,
                        {
                            $class_names: report.template.record.header_css_class,
                            $value: key$String,
                        }
                    );

                    record$String += text.merge.template(
                        report.template.record.cell_00001,
                        {
                            $class_names: report.template.record.cell_css_class,
                            $value: json$Dictionary[key$String],
                        }
                    );
                }
            }
            log.value.write("record$String", record$String, log.constants.debug);

            html$String += text.merge.template(
                report.template.record.record_type_00001,
                {
                    $class_names: report.template.record.record_css_class,
                    $value: record$String,
                }
            );

            log.value.write("html$String", html$String, log.constants.debug);
            log.value.write("form.template.web.style_00001", form.template.web.style_00001, log.constants.debug);
            html$String = report.template.record.style_00001 + html$String;
        }

        result$String = html$String;
        log.function.return("Return result$String from fromJSON", result$String, log.constants.debug);
        return result$String;
    }

};

module.exports = recordFunctions;