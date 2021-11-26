"use strict";

const file      = require('.');
const log       = require('../log');
const test      = require('../test');
const text      = require('../text');
const value     = require('../value');

let spreadsheetFunctions = {

    upload(path$String)
    {
        let html$String = '';

        html$String += text.merge.template(
            file.template.upload.drag_and_drop_00001,
            {
                $endpoint: path$String
            }
        );

        return html$String;
    },

    process(path$String)
    {
        log.function.write("Read spreadsheet from a file and parse", log.constants.debug);
        log.value.write("path$String", path$String, log.constants.debug);

        if (test.assertion.notEmpty$String(path$String))
        {
            const xlsx = require('xlsx');
            const workbook$ParsedXLSX = xlsx.readFile(path$String);
            log.value.write("Parsed workbook", workbook$ParsedXLSX, log.constants.debug);

            const worksheets$ArrayString = workbook$ParsedXLSX.SheetNames;
            log.value.write("worksheets$ArrayString: list of worksheets", worksheets$ArrayString, log.constants.debug);

            const firstWorksheet$Dictionary = workbook$ParsedXLSX.Sheets[worksheets$ArrayString[0]];
            log.function.return("Returning first worksheet as firstWorksheet$Dictionary", firstWorksheet$Dictionary, log.constants.debug);

            const parsedFirstWorksheet$Dictionary = xlsx.utils.sheet_to_json(firstWorksheet$Dictionary, {range: 0, defval: ""});
            log.function.return("Returning first worksheet as parsedFirstWorksheet$Dictionary", parsedFirstWorksheet$Dictionary, log.constants.debug);

            return firstWorksheet$Dictionary;
        }

        return null;
    },

    getHeaders(json$Dictionary)
    {
        log.function.write("Getting headers from spreadsheet represented as json", log.constants.debug);
        let result$ArrayDictionary = [];

        for (let cellKey$String in json$Dictionary)
        {
            if(test.value.equal$String('!ref', cellKey$String))
                continue;
            if (cellKey$String.indexOf('1') === 1)
            {
                let header$String = json$Dictionary[cellKey$String]['w'];
                log.value.write("header$String", header$String, log.constants.debug);

                result$ArrayDictionary.push(header$String);
            }
            else break;

        }

        log.function.return("Returning result$ArrayDictionary from getHeaders", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

    // toArrayDictionary(json$Dictionary, headerRowIncluded$Boolean = true)
    // {
    //     log.function.write("Convert raw spreadsheet JSON to ArrayDictionary", log.constants.debug);
    //     let result$ArrayDictionary = [];
    //
    //     let headers$ArrayDictionary = this.getHeaders(json$Dictionary);
    //     log.value.write("headers$ArrayDictionary: headers of spreadsheet", headers$ArrayDictionary, log.constants.debug);
    //
    //     let headerNumber$Integer = 0;
    //     let row$Dictionary = {};
    //     for (let cellKey$String in json$Dictionary)
    //     {
    //         if(test.value.equal$String('!ref', cellKey$String))
    //             continue;
    //
    //         // todo: check for empty cells
    //
    //         if (test.value.notEmpty$Object(json$Dictionary[cellKey$String]['w']))
    //             row$Dictionary["_" + headers$ArrayDictionary[headerNumber$Integer++] + "_"] = json$Dictionary[cellKey$String]['w'];
    //         else
    //             row$Dictionary["_" + headers$ArrayDictionary[headerNumber$Integer++] + "_"] = '';
    //
    //         if (headerNumber$Integer >= headers$ArrayDictionary.length)
    //         {
    //             headerNumber$Integer = 0;
    //             result$ArrayDictionary.push(row$Dictionary);
    //             log.value.write("Pushing row$Dictionary", row$Dictionary, log.constants.debug);
    //
    //             row$Dictionary = {};
    //         }
    //     }
    //
    //     if (headerRowIncluded$Boolean)
    //     {
    //         log.comment.write("Removing header row", log.constants.debug);
    //         result$ArrayDictionary.shift();
    //     }
    //
    //     log.function.return("Returning result$ArrayDictionary from toArrayDictionary", result$ArrayDictionary, log.constants.debug);
    //     log.value.write("result$ArrayDictionary", result$ArrayDictionary, log.constants.debug);
    //     return result$ArrayDictionary;
    // },

    toArrayArray(json$Dictionary, includeHeaderRow$Boolean = false)
    {
        // todo: convert this to stream to support larger spreadsheets

        log.function.write("Convert raw spreadsheet JSON to two-dimensional array", log.constants.debug);
        let result$ArrayArray = [];

        log.value.write("json$Dictionary: JSON dictionary", json$Dictionary, log.constants.debug);

        let headers$ArrayDictionary = this.getHeaders(json$Dictionary);
        log.value.write("headers$ArrayDictionary", headers$ArrayDictionary, log.constants.debug);

        let headers$Integer = test.value.numberOfItems$Array(headers$ArrayDictionary);
        log.value.write("headers$Integer", headers$Integer, log.constants.debug);

        let headerNumber$Integer = 0;
        let rowNumber$Integer = 0;
        let index$Integer = 0;


        for (let key$String in json$Dictionary)
        {
            log.value.write("key$String", key$String, log.constants.debug);
            log.value.write("headerNumber$Integer", headerNumber$Integer, log.constants.debug);

            let keyRowNumber$Integer = value.convert.toIntegerFromString(key$String.replace(/[A-Z]/g, ''));
            log.value.write("keyRowNumber$Integer", keyRowNumber$Integer, log.constants.debug);

            if (!test.assertion.is$Integer(keyRowNumber$Integer) || test.value.equal$String('!ref', key$String))
            {
                log.comment.write("Continuing loop", log.constants.debug);
                continue;
            }

            let currentValue$NumberOrString = json$Dictionary[key$String]['w']; // w is sometimes empty for strings
            if (test.value.empty$Object(currentValue$NumberOrString))
                currentValue$NumberOrString = json$Dictionary[key$String]['v'];
            log.value.write("currentValue$NumberOrString", currentValue$NumberOrString, log.constants.debug);

            if (keyRowNumber$Integer - 1 !== rowNumber$Integer)
            {
                let i = headerNumber$Integer;
                while (headerNumber$Integer < headers$Integer)
                {
                    log.value.write("Checking headerNumber$Integer", headerNumber$Integer, log.constants.debug);

                    result$ArrayArray.push([rowNumber$Integer + 1, headerNumber$Integer + 1, '', '']);
                    log.value.write("[rowNumber$Integer + 1, headerNumber$Integer + 1, '', '']", [rowNumber$Integer + 1, headerNumber$Integer + 1, '', ''], log.constants.debug);

                    headerNumber$Integer++;
                }
                headerNumber$Integer = 0;
                rowNumber$Integer++;
                result$ArrayArray.push([rowNumber$Integer + 1, headerNumber$Integer + 1, currentValue$NumberOrString, '']);
                headerNumber$Integer++;
                continue;
            }

            result$ArrayArray.push([rowNumber$Integer + 1, headerNumber$Integer + 1, currentValue$NumberOrString, '']);
            log.value.write("result$ArrayArray[" + index$Integer + "]", result$ArrayArray[index$Integer++], log.constants.debug);


            if (++headerNumber$Integer >= headers$Integer)
            {
                headerNumber$Integer = 0;
                rowNumber$Integer++;
            }
        }

        if (!includeHeaderRow$Boolean)
        {
            log.comment.write("Removing header row", log.constants.debug);
            result$ArrayArray.shift();
        }

        log.function.return("Returning result$ArrayArray from toArrayArray", result$ArrayArray, log.constants.debug);
        log.value.write("result$ArrayArray", result$ArrayArray, log.constants.debug);
        return result$ArrayArray;
    }

};

module.exports = spreadsheetFunctions;
