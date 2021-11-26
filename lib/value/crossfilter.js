"use strict";

const log  = require('../log');
const test = require('../test');

let crossfilterFunctions = {

    occursMostOftenInArrayDictionary(json$ArrayDictionary, field$String)
    {
        log.function.write("Find which value in field of ArrayDictionary occurs most often", log.constants.debug);
        let result$StringOrNumber = null;

        if
        (
            test.assertion.notEmpty$Array(json$ArrayDictionary) &&
            test.assertion.notEmpty$String(field$String)
        )
        {
            let fieldValues$ArrayStringOrNumber = [];
            for (let i = 0; i < json$ArrayDictionary.length; i++)
            {
                fieldValues$ArrayStringOrNumber.push(json$ArrayDictionary[i][field$String]);
            }
            result$StringOrNumber = this.occursMostOftenInArray(fieldValues$ArrayStringOrNumber);
        }

        log.function.return("Returning result$StringOrNumber from occursMostOftenInArrayDictionary", result$StringOrNumber, log.constants.debug);
        return result$StringOrNumber;
    },

    occursMostOftenInArray(array)
    {
        log.function.write("Find which value in field of array occurs most often", log.constants.debug);
        log.value.write("Input array", array, log.constants.debug);
        if(array.length == 0)
            return null;
        let modeMap = {};
        let maxEl = array[0], maxCount = 1;
        for(let i = 0; i < array.length; i++)
        {
            let el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        log.function.return("modeMap: map of all counts", modeMap, log.constants.debug);
        log.function.return("Returning maxEl from occursMostOftenInArray", maxEl, log.constants.debug);
        return maxEl;
    },

}; module.exports = crossfilterFunctions;