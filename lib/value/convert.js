"use strict";

const account       = require('../account');
const database      = require('../database');
const grammar       = require('../grammar');
const html          = require('../html');
const log           = require('../log');
const report        = require('../report');
const test          = require('../test');
const text          = require('../text');
const value         = require('.');

let convertFunctions = {

    // Functions that convert the input value to a different data type

    toValueFromArrayArrayDictionaryOkPacket(value$ArrayArrayDictionary) // untested
    {
        log.function.write("Convert data type returned from database and reads a single value to return. The rest are discarded", log.constants.debug);
        log.value.write("value$ArrayArrayDictionary", value$ArrayArrayDictionary, log.constants.debug);

        let result$StringOrNumber = null;

        if (test.value.notEmpty$Array(value$ArrayArrayDictionary))
        {
            if (test.assertion.inBounds$Array(value$ArrayArrayDictionary, 1))
            {
                let value$ArrayDictionary = this.toArrayDictionaryFromArrayArrayDictionaryOkPacket(value$ArrayArrayDictionary);
                if (test.assertion.inBounds$Array(value$ArrayDictionary, 1))
                {
                    let value$KeyValuePair = value$ArrayDictionary[1];
                    result$StringOrNumber = value.extract.keyFromKeyValuePair(value$KeyValuePair);
                }
            }
        }

        log.function.return("Returning result$StringOrNumber from toValueFromArrayArrayDictionaryOkPacket", result$StringOrNumber);
        return result$StringOrNumber;
    },

    toValueFromArrayDictionary(value$ArrayDictionary)
    {
        log.function.write("Reading a single value from an array of key value pairs to return. The rest are discarded", log.constants.debug);

        let result$Object = null;

        if (test.value.numberOfItems$Array(value$ArrayDictionary) >= 1)
            if (test.value.is$KeyValuePair(value$ArrayDictionary[0]))
                result$Object = value.extract.valueFromKeyValuePair(value$ArrayDictionary[0]);

        return result$Object;
    },

    toArrayFromArrayArray(arrays$Array2D)
    {
        let result$Array = [];
        if(test.value.notEmpty$Array(arrays$Array2D))
        {
            for(let array$Array of arrays$Array2D)
            {
                if(test.value.notEmpty$Array(array$Array))
                {
                    for(let element$AnyType of array$Array)
                    {
                        result$Array.push(element$AnyType);
                    }
                }
            }
        }
        return result$Array;

    },

    toArrayDictionaryFromArrayArrayDictionaryOkPacket(value$ArrayArrayDictionary)
    {
        log.function.write("Convert data type returned from database to JSON", log.constants.debug);

        let result$ArrayDictionary = [];

        if (test.assertion.inBounds$Array(value$ArrayArrayDictionary, 1))
        {
            let rowDataPackets$ArrayDictionary = value$ArrayArrayDictionary[1];
            result$ArrayDictionary = JSON.parse(JSON.stringify(rowDataPackets$ArrayDictionary));
        }

        return result$ArrayDictionary;
    },

    toDatabaseNameFromAccountID(accountID$String)
    {
        let hashedAccountName$String = account.secure.obfuscatedAccountID(accountID$String);
        return database.constants.prefix.user_database + hashedAccountName$String;
    },

    toIntegerFromString(value$String)
    {
        let result$Integer = null;

        result$Integer = parseInt(value$String);
        if (!test.assertion.is$Integer(result$Integer)) result$Integer = null;

        return result$Integer;
    },

    toStringFromToken(token$ArrayDictionary)
    {
        let result$String = '';

        if
        (
            test.value.hasKey(token$ArrayDictionary, grammar.constants.database.database_name_variable) &&
            test.value.hasKey(token$ArrayDictionary, grammar.constants.database.table_name_variable) &&
            test.value.hasKey(token$ArrayDictionary, grammar.constants.database.column_name_variable)
        )
        {
            result$String += "`" + token$ArrayDictionary[grammar.constants.database.database_name_variable] + "`.";
            result$String += "`" + token$ArrayDictionary[grammar.constants.database.table_name_variable] + "`.";
            result$String += "`" + token$ArrayDictionary[grammar.constants.database.column_name_variable] + "`";
        }

        return result$String;
    },

    toCSSGridFromArrayDictionary(data$ArrayDictionary)
    {
        log.function.write("Convert array dictionary to CSS grid", log.constants.debug);
        log.value.write("Data to convert as data$ArrayDictionary", data$ArrayDictionary, log.constants.debug);

        let result$String = '';
        let html$String = '';

        if (test.assertion.notEmpty$Array(data$ArrayDictionary))
        {
            let tableHeadings$ArrayString = Object.keys(data$ArrayDictionary[0]);
            let headerRow$String = '';

            for (let tableHeading$String of tableHeadings$ArrayString)
            {
                headerRow$String += text.merge.template
                (
                    report.template.web.header_cell_00001,
                    {
                        $class_names    : report.template.web.header_cell_css_class,
                        $value          : this.toTitleCaseFromString(tableHeading$String)
                    }
                );
            }

            let reportContent$String = '';
            log.value.write("tableHeadings$ArrayString", tableHeadings$ArrayString, log.constants.debug);

            for (let i = 0; i < data$ArrayDictionary.length; i++)
            {
                for (let tableHeading$String of tableHeadings$ArrayString)
                {
                    reportContent$String += text.merge.template
                    (
                        report.template.web.cell_00001,
                        {
                            $class_names    : report.template.web.report_cell_css_class,
                            $value          : data$ArrayDictionary[i][tableHeading$String]
                        }
                    );
                }
            }

            html$String = text.merge.template
            (
                report.template.web.style_00001,
                {
                    $value: tableHeadings$ArrayString.length
                }
            ) + html$String;

            html$String += text.merge.template
            (
                report.template.web.report_type_00001,
                {
                    $class_names    : report.template.web.report_css_class,
                    $value          : headerRow$String + reportContent$String
                }
            );
        }

        log.function.return("Returning html$String from toCSSGridFromArrayDictionary", html$String, log.constants.debug);

        result$String = html$String;
        return result$String;
    },

    toTitleCaseFromString(text$String)
    {
        let result$String = '';

        if (test.assertion.notEmpty$String(text$String))
        {
            result$String = text$String.split(' ').map( (element$String) => element$String.charAt(0).toUpperCase() + element$String.slice(1)).join(' ');
        }

        return result$String;
    },

    toHTMLIDFromString(text$String)
    {
        let result$String = '';
        if(test.assertion.notEmpty$String(text$String))
        {
            // Replace spaces
            return text$String.replace(/[\W_]+/g, database.constants.identifiers.html_id_space_replacement);
        }
        return result$String;
    },

    toStringFromHTMLID(text$String)
    {
        let result$String = '';
        if(test.assertion.notEmpty$String(text$String))
        {
            result$String = text$String.split(database.constants.identifiers.html_id_space_replacement).join(" ");
        }
        return result$String;
    },

    toColumnLettersFromInteger(n) { // todo: test
        var ordA = 'a'.charCodeAt(0);
        var ordZ = 'z'.charCodeAt(0);
        var len = ordZ - ordA + 1;

        var s = "";
        while(n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s;
    },

    toHTMLEncoded(text$String, replaceLineBreaksWithHTML$Boolean = false)
    {
        let _lineBreakPlaceholder$String = "&linebreak";
        let _lineBreakPlaceholderEncoded$String = '';

        if(test.assertion.notEmpty$String(text$String))
        {
            if(replaceLineBreaksWithHTML$Boolean)
            {
                text$String = text$String.replace(/\n/g, _lineBreakPlaceholder$String);
                _lineBreakPlaceholderEncoded$String = this.toHTMLEncoded(_lineBreakPlaceholder$String);
            }

            let buf = [];

            for (let i = text$String.length - 1; i >= 0; i--)
            {
                buf.unshift(['&#', text$String[i].charCodeAt(), ';'].join(''));
            }

            let result$String = buf.join('');

            if(replaceLineBreaksWithHTML$Boolean)
            {
                result$String = result$String.replace(
                    /&#38;&#108;&#105;&#110;&#101;&#98;&#114;&#101;&#97;&#107;/g,
                    html.constants.construct.line_break
                );
            }

            return result$String;
        }
        return text$String;
    },

    toTextFromHTMLEncoded(encodedText$String)
    {
        // todo: test
        return encodedText$String.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });
    },

};

module.exports = convertFunctions;