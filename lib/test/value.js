"use strict";

const globals   = require('../globals');
const log       = require('../log');
const text      = require('../text');

let checkFunctions =
{
    hasKey(object, property$String)
    {
        return this.notEmpty$Object(object) && object.hasOwnProperty(property$String);
    },

    notEmpty$Object(object)
    {
        return !(object === null || typeof(object) === "undefined" || typeof(object) === NaN);
    },

    notEmpty$String(string)
    {
        return (string && 0 !== string.length) && string !== '' && string !== null;
    },

    empty$String(string)
    {
        return !this.notEmpty$String(string);
    },

    inBounds$Array(array, index)
    {
        return array.length > index;
    },

    notEmpty$Array(array)
    {
        return Array.isArray(array) && array.length > 0 && this.notEmpty$Object(array);
    },

    notEmpty$Dictionary(obj)
    {
        return !(this.empty$Dictionary(obj));
    },

    notEmpty$Integer(value)
    {
        // Do not type check; use ==, not ===
        let result$Boolean = parseInt(value, 10) == value;

        return result$Boolean && this.notEmpty$Object(value);
    },

    notEmpty$KeyValuePair(obj)
    {
        return this.notEmpty$Dictionary(obj);
    },

    empty$Array(array)
    {
        return !(this.notEmpty$Array(array));
    },

    empty$Dictionary(obj)
    {
        for (let key in obj)
        {
            if (obj.hasOwnProperty(key))
            {
                return false;
            }
        }
        return true;
    },

    empty$Object(object)
    {
        return !(this.notEmpty$Object(object));
    },

    equal$String(string1, string2)
    {
        return string1 === string2;
    },

    equal$DictionaryString(a, b)
    {
        // Create arrays of property names
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    },

    is$Boolean(object)
    {
        return typeof object === "boolean";
    },

    is$Integer(object)
    {
        return Number.isInteger(object);
    },

    is$Dictionary(obj)
    {
        return typeof obj ==='object' && obj !==null && !(obj instanceof Array) && !(obj instanceof Date) && !(obj instanceof RegExp);
    },

    is$KeyValuePair(obj)
    {
        return this.is$Dictionary(obj) && Object.keys(obj).length === 1;
    },

    in$Set(obj, value)
    {
        if (obj !== null && obj !== undefined) return obj.has(value);
        else return false;
    },

    numberOfItems$Dictionary(obj)
    {
        let numberOfItems$Integer = 0;
        if (this.notEmpty$Dictionary(obj))
        {
            numberOfItems$Integer = Object.keys(obj).length;
        }
        return numberOfItems$Integer;
    },

    numberOfItems$Array(obj)
    {
        if(this.notEmpty$Array(obj))
        {
            return obj.length;
        }
        return 0;
    },

    contains$String(string, value)
    {
        let result$Boolean = false;

        if(this.notEmpty$String(string))
        {
            string = string.toString();

            result$Boolean = string.includes(value);
        }
        else
        {
            result$Boolean = false;
        }

        return result$Boolean;
    },

    containsTokenJustNotSubstring$String(text$String, valueToCheckFor$String, caseSensitive$Boolean = false, separator$Character = ' ')
    {
        if(this.empty$String(text$String))
        {
            return false;
        }

        if(this.empty$String(valueToCheckFor$String))
        {
            return true;
        }

        if(!caseSensitive$Boolean)
        {
            text$String = text$String.toUpperCase();
            valueToCheckFor$String = valueToCheckFor$String.toUpperCase();
        }

        let stringLocations$ArrayInteger =
            text.find.allOccurrencesOfString(text$String, valueToCheckFor$String);

        if(this.notEmpty$Array(stringLocations$ArrayInteger))
        {
            for(let stringLocation$Integer of stringLocations$ArrayInteger)
            {
                let hasToken$Boolean = this.hasTokenAtPosition$String
                (
                    text$String,
                    valueToCheckFor$String,
                    stringLocation$Integer,
                    caseSensitive$Boolean
                );
                if(hasToken$Boolean)
                {
                    return true;
                }
            }
        }

        return false;
    },

    hasTokenAtPosition$String(text$String, valueToCheckFor$String, leftLocationOfValue$Integer, caseSensitive$Boolean = false)
    {
        log.function.write("Check whether a token exists in a position of a string", log.constants.debug);
        log.value.write("Main string as text$String", text$String, log.constants.debug);
        log.value.write("String to check for as valueToCheckFor$String", valueToCheckFor$String, log.constants.debug);

        let characterToLeftOk$Boolean = false;
        let characterToRightOk$Boolean = false;

        if (leftLocationOfValue$Integer < 0)
        {
            log.value.write("Value of leftLocationOfValue$Integer is less than zero; cannot check, returning false", leftLocationOfValue$Integer, log.constants.debug);
            return false;
        }

        text$String = (caseSensitive$Boolean)
            ? text$String
            : text$String.toUpperCase();

        valueToCheckFor$String = (caseSensitive$Boolean)
            ? valueToCheckFor$String
            : valueToCheckFor$String.toUpperCase();

        let textSubstring$String = text$String.substr(leftLocationOfValue$Integer, valueToCheckFor$String.length);
        log.value.write("String at location specified by leftLocationOfValue$Integer as textSubstring$String", textSubstring$String, log.constants.debug);

        let containsSubstring$Boolean = this.equal$String(textSubstring$String, valueToCheckFor$String);
        log.value.write("textSubstring$String matches valueToCheckFor$String as containsSubstring$Boolean", containsSubstring$Boolean, log.constants.debug);

        if(containsSubstring$Boolean)
        {
            if(leftLocationOfValue$Integer === 0)
            {
                characterToLeftOk$Boolean = true;
                log.value.write("Assigning characterToLeftOk$Boolean true because string is at beginning, no character to left", characterToLeftOk$Boolean, log.constants.debug);
            }
            else
            {
                let characterToLeft$Character = text$String.charAt(leftLocationOfValue$Integer - 1);
                log.comment.write("Character to left of token as characterToLeft$Character: '" + characterToLeft$Character + "'", log.constants.debug);

                characterToLeftOk$Boolean = this.contains$String(globals.localization.allowedCharacterSets.all_delimiters, characterToLeft$Character);
                log.value.write("All allowed delimiters:", globals.localization.allowedCharacterSets.all_delimiters, log.constants.debug);
                log.value.write("Checked character to left of string against list of allowed delimiters as characterToLeftOk$Boolean", characterToLeftOk$Boolean, log.constants.debug);
            }

            let rightLocationOfValue$Integer = leftLocationOfValue$Integer + valueToCheckFor$String.length;

            if(rightLocationOfValue$Integer === text$String.length)
            {
                characterToRightOk$Boolean = true;
                log.value.write("Character to the right is at the end of the string as characterToRightOk$Boolean", characterToRightOk$Boolean, log.constants.debug);
            }
            else if(rightLocationOfValue$Integer < text$String.length)
            {
                let characterToRight$Character = text$String.charAt(rightLocationOfValue$Integer);
                log.comment.write("Character to right of token as characterToRight$Character: '" + characterToRight$Character + "'", log.constants.debug);

                characterToRightOk$Boolean = this.contains$String(globals.localization.allowedCharacterSets.all_delimiters, characterToRight$Character);
                log.value.write("All allowed delimiters:", globals.localization.allowedCharacterSets.all_delimiters, log.constants.debug);
                log.value.write("Checked character to right of string against list of allowed delimiters as characterToRightOk$Boolean", characterToRightOk$Boolean, log.constants.debug);
            }
        }

        let result$Boolean = characterToLeftOk$Boolean && characterToRightOk$Boolean && containsSubstring$Boolean;
        return result$Boolean;
    },

    anyInvalidCharacters$String(text$String, legalCharacters$String = globals.localization.allAllowedCharacters())
    {
        if
        (
            this.notEmpty$String(text$String)
            && this.notEmpty$String(legalCharacters$String)
        )
        {
            for(let i = 0; i < text$String.length; i++)
            {
                let current$Character = text$String.charAt(i);

                if
                (
                    !this.contains$String(legalCharacters$String, current$Character)
                )
                {
                    return current$Character;
                }
            }
        }
        return '';
    },

    anyInvalidCharactersInValues$Dictionary(json$Dictionary, legalCharacters$String = globals.localization.allAllowedCharacters())
    {
        log.function.write("Checking if there are any disallowed characters in string", log.constants.debug);

        log.value.write("json$Dictionary", json$Dictionary, log.constants.debug);

        for(let key$String in json$Dictionary)
        {
            let currentValue$String = json$Dictionary[key$String];

            log.value.write("currentValue$String", currentValue$String, log.constants.debug);

            let invalidCharacters$String = this.anyInvalidCharacters$String
            (
                currentValue$String,
                legalCharacters$String
            );

            if (this.notEmpty$String(invalidCharacters$String))
            {
                let pairWithInvalidCharacter$KeyValuePair = { [key$String] : invalidCharacters$String };

                log.value.write("pairWithInvalidCharacter$KeyValuePair", pairWithInvalidCharacter$KeyValuePair, log.constants.debug);

                return pairWithInvalidCharacter$KeyValuePair;
            }
        }

        return null;
    },

    trueNotErrorMessage(value$BooleanOrString)
    {
        log.function.write("Checking if value is true or contains an error message", log.constants.debug);
        log.value.write("value$BooleanOrString", value$BooleanOrString, log.constants.debug);

        let result$Boolean = false;
        if (this.is$Boolean(value$BooleanOrString) && value$BooleanOrString === true)
            result$Boolean = true;

        log.function.return("Returning result$Boolean from trueNotErrorMessage", result$Boolean, log.constants.debug);
        return !!result$Boolean;
    }

};

module.exports = checkFunctions;