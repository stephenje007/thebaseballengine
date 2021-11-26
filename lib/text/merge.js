"use strict";

const text = require('./');
const test = require('../test');

let mergeFunctions = {

    template(template$String, variablesToMerge$Dictionary, mergeDefaults$Boolean = true)
    {
        let result$String = template$String;
        for(let variable$String in variablesToMerge$Dictionary)
        {
            let delimitedVariable$String = text.constants.merge.delineator + variable$String + text.constants.merge.delineator;

            let replacement$String = variablesToMerge$Dictionary[variable$String];

            if (test.value.empty$String(replacement$String))
                replacement$String = '';

            if (test.value.notEmpty$String(result$String))
                result$String = result$String.split(delimitedVariable$String).join(replacement$String);
        }

        if (mergeDefaults$Boolean)
            result$String = this.defaults(result$String);

        return result$String;
    },

    defaults(text$String)
    {
        if(test.value.notEmpty$String(text$String))
        {
            let substitutionVariablesToReplace$ArrayString = text$String.match(/\|\$.*?\|/g); // ? means non-greedy
            substitutionVariablesToReplace$ArrayString = [...new Set(substitutionVariablesToReplace$ArrayString)];

            // log.write.object({substitutionVariablesToReplace$ArrayString}, _debug);

            let regex$RegExp = new RegExp("\\" + text.constants.merge.delineator, 'g');
            for (let variableToReplace$String of substitutionVariablesToReplace$ArrayString)
            {
                let nameOfDefault$String = variableToReplace$String.replace(regex$RegExp, '');

                // log.write.text(`globals.defaults[${nameOfDefault$String}]: ` +
                //     databaseConstants.defaults[nameOfDefault$String], _debug);

                if(test.value.hasKey(text.constants.defaults, nameOfDefault$String))
                {
                    text$String = text$String.replace
                    (
                        variableToReplace$String,
                        text.constants.defaults[nameOfDefault$String]
                    );
                }
                else
                {
                    text$String = text$String.replace(variableToReplace$String, '');
                }
                // log.write.object({text$String}, _debug);
            }
            // log.write.object({text$String}, _debug);
        }

        return text$String;
    }

};

module.exports = mergeFunctions;