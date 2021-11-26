"use strict";

const log       = require('../log');
const grammar  = require('.');
const test      = require('../test');

let parsingFunctions = {

    intoPhrases(tokens$ArrayDictionary)
    {

    },

    interrogatives(tokens$ArrayDictionary)
    {
        log.function.write("Get the type of question and its subjects", log.constants.debug);
        let result$ArrayArrayDictionary = [];

        if (test.assertion.notEmpty$Array(tokens$ArrayDictionary))
        {
            for (let i = 0; i < tokens$ArrayDictionary.length; i++)
            {
                let currentToken$Dictionary = tokens$ArrayDictionary[i];
                log.value.write("Current token to check for comparison at index " + i, currentToken$Dictionary, log.constants.debug);

                let currentPartOfSpeech$String = currentToken$Dictionary[grammar.constants.database.part_of_speech_variable];
                log.value.write("Current part of speech at " + i, currentPartOfSpeech$String, log.constants.debug);

                let foundComparison$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.interrogative.name);
                if (foundComparison$Boolean)
                {
                    let nextNounPhrase$ArrayDictionary = this.nextNounPhrase(tokens$ArrayDictionary, i);
                    let interrogativePhrase$ArrayDictionary = [];
                    interrogativePhrase$ArrayDictionary.push(currentToken$Dictionary);
                    interrogativePhrase$ArrayDictionary = interrogativePhrase$ArrayDictionary.concat(nextNounPhrase$ArrayDictionary);
                    result$ArrayArrayDictionary.push(interrogativePhrase$ArrayDictionary);
                }
            }
        }
        log.function.return("Returning comparison lists as result$ArrayArrayDictionary from grammar.parse.interrogatives", result$ArrayArrayDictionary, log.constants.debug);
        return result$ArrayArrayDictionary;

    },

    subjects(tokens$ArrayDictionary)
    {
        log.function.write("Get the subjects of the request using the first noun phrase found", log.constants.debug);

        let result$ArrayDictionary = [];
        result$ArrayDictionary = this.nextNounPhrase(tokens$ArrayDictionary);

        log.function.return("Returning subjects as result$ArrayDictionary from grammar.parse.subjects", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

    comparisons(tokens$ArrayDictionary)
    {
        // todo: include related noun aggregates

        log.function.write("Comparisons limit the number of subjects returned", log.constants.debug);

        let result$ArrayArrayDictionary = [];

        if (test.assertion.notEmpty$Array(tokens$ArrayDictionary))
        {
            for (let i = 0; i < tokens$ArrayDictionary.length; i++)
            {
                let currentToken$Dictionary = tokens$ArrayDictionary[i];
                log.value.write("Current token to check for comparison at index " + i, currentToken$Dictionary, log.constants.debug);

                let currentPartOfSpeech$String = currentToken$Dictionary[grammar.constants.database.part_of_speech_variable];
                log.value.write("Current part of speech at " + i, currentPartOfSpeech$String, log.constants.debug);

                let foundComparison$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.comparison.name);
                if (foundComparison$Boolean)
                {
                    let nextNounPhrase$ArrayDictionary = this.nextNounPhrase(tokens$ArrayDictionary, i, true);
                    let comparisonPhrase$ArrayDictionary = [];
                    comparisonPhrase$ArrayDictionary.push(currentToken$Dictionary);
                    comparisonPhrase$ArrayDictionary = comparisonPhrase$ArrayDictionary.concat(nextNounPhrase$ArrayDictionary);
                    result$ArrayArrayDictionary.push(comparisonPhrase$ArrayDictionary);
                }
            }
        }
        log.function.return("Returning comparison lists as result$ArrayArrayDictionary from grammar.parse.comparisons", result$ArrayArrayDictionary, log.constants.debug);
        return result$ArrayArrayDictionary;
    },

    prepositionals(tokens$ArrayDictionary)
    {
        log.function.write("Prepositionals specify ranges, usually between dates or locations", log.constants.debug);
        log.comment.write("Currently prepositionals are simplified to represent only dates", log.constants.debug);

        let result$ArrayArrayDictionary = [];

        if (test.assertion.notEmpty$Array(tokens$ArrayDictionary))
        {
            for (let i = 0; i < tokens$ArrayDictionary.length; i++)
            {
                let currentToken$Dictionary = tokens$ArrayDictionary[i];
                log.value.write("Current token to check for comparison at index " + i, currentToken$Dictionary, log.constants.debug);

                let currentPartOfSpeech$String = currentToken$Dictionary[grammar.constants.database.part_of_speech_variable];
                log.value.write("Current part of speech at " + i, currentPartOfSpeech$String, log.constants.debug);

                let foundComparison$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.preposition.name);
                if (foundComparison$Boolean)
                {
                    let nextNounPhrase$ArrayDictionary = this.nextNounPhrase(tokens$ArrayDictionary, i, true);
                    let prepositionalPhrase$ArrayDictionary = [];
                    prepositionalPhrase$ArrayDictionary.push(currentToken$Dictionary);
                    prepositionalPhrase$ArrayDictionary = prepositionalPhrase$ArrayDictionary.concat(nextNounPhrase$ArrayDictionary);
                    result$ArrayArrayDictionary.push(prepositionalPhrase$ArrayDictionary);
                }
            }
        }

        log.function.return("Returning prepositional lists as result$ArrayArrayDictionary from grammar.parse.prepositions", result$ArrayArrayDictionary, log.constants.debug);
        return result$ArrayArrayDictionary;
    },

    computations(tokens$ArrayDictionary)
    {

    },

    formulas(tokens$ArrayDictionary)
    {

    },

    nextNounPhrase(tokens$ArrayDictionary, index$Integer = 0,  differentNounTypesAllowed$Boolean = false, exclude$SetString = null, include$SetString = null)
    {
        log.function.write("Get the next noun phrase starting at the supplied index", log.constants.debug);

        let result$ArrayDictionary = [];

        log.value.write("Tokens in array dictionary:", tokens$ArrayDictionary, log.constants.debug);

        if (test.assertion.notEmpty$Array(tokens$ArrayDictionary))
        {
            log.comment.write("Advance index until a noun or adjective is found", log.constants.debug);
            let startIndex$Integer = index$Integer - 1;
            let currentToken$Dictionary = {};
            let currentPartOfSpeech$String = '';
            let foundNounOrAdjective$Boolean = false;
            do
            {
                startIndex$Integer++;
                let currentToken$Dictionary = tokens$ArrayDictionary[startIndex$Integer];
                log.value.write("Current token to check for noun phrase beginning at index " + startIndex$Integer, currentToken$Dictionary, log.constants.debug);

                currentPartOfSpeech$String = currentToken$Dictionary[grammar.constants.database.part_of_speech_variable];
                log.value.write("Current part of speech at " + startIndex$Integer, currentPartOfSpeech$String, log.constants.debug);

                foundNounOrAdjective$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.noun.name);
                if (!foundNounOrAdjective$Boolean)
                    foundNounOrAdjective$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.adjective.name);

            }
            while (startIndex$Integer < tokens$ArrayDictionary.length - 1 && !foundNounOrAdjective$Boolean);

            let specificNounPartOfSpeech$String = '';
            for (let i = startIndex$Integer; i < tokens$ArrayDictionary.length; i++)
            {
                let currentPartOfSpeech$String = tokens$ArrayDictionary[i][grammar.constants.database.part_of_speech_variable];
                log.value.write("Part of speech for tokens$ArrayDictionary[" + i + "]:", currentPartOfSpeech$String, log.constants.debug);
                log.value.write("specificNounPartOfSpeech$String: an empty specificNounPartOfSpeech$String will let an adjective through for testing", specificNounPartOfSpeech$String, log.constants.debug);


                if
                (
                    test.value.empty$String(specificNounPartOfSpeech$String) ||
                    differentNounTypesAllowed$Boolean
                )
                {
                    log.comment.write("Either first noun found or different noun types are allowed", log.constants.debug);

                    let foundNounOfAnyType$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.noun.name);

                    let foundInExclude$Boolean = test.value.in$Set(exclude$SetString, currentPartOfSpeech$String);
                    log.value.write("exclude$SetString:", exclude$SetString, log.constants.debug);
                    log.value.write("foundInExclude$Boolean:", foundInExclude$Boolean, log.constants.debug);

                    let foundInInclude$Boolean = test.value.in$Set(include$SetString, currentPartOfSpeech$String);
                    log.value.write("include$SetString:", include$SetString, log.constants.debug);
                    log.value.write("foundInInclude$Boolean:", foundInInclude$Boolean, log.constants.debug);

                    let foundAdjectiveOfAnyType$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.adjective.name);

                    log.comment.write("Current token: '" + tokens$ArrayDictionary[i][grammar.constants.database.token_string_variable] + "'", log.constants.debug);
                    log.comment.write("Checking currentPartOfSpeech$String '" + currentPartOfSpeech$String + "' for noun", log.constants.debug);
                    log.comment.write("foundNounOfAnyType$Boolean: " + foundNounOfAnyType$Boolean, log.constants.debug);
                    log.comment.write("foundAdjectiveOfAnyType$Boolean: " + foundAdjectiveOfAnyType$Boolean, log.constants.debug);

                    if ((foundNounOfAnyType$Boolean || foundInInclude$Boolean) && !foundInExclude$Boolean)
                    {
                        specificNounPartOfSpeech$String = currentPartOfSpeech$String;
                        log.value.write("Found noun part of speech, setting specificNounPartOfSpeech$String to:", specificNounPartOfSpeech$String, log.constants.debug);

                        result$ArrayDictionary.push(tokens$ArrayDictionary[i]);
                        log.value.write("Pushed noun into result$ArrayDictionary:", result$ArrayDictionary, log.constants.debug);
                    }
                    else if ((foundAdjectiveOfAnyType$Boolean && foundInInclude$Boolean) && !foundInExclude$Boolean)
                    {
                        result$ArrayDictionary.push(tokens$ArrayDictionary[i]);
                        log.comment.write("Pushed adjective into result$ArrayDictionary:", result$ArrayDictionary, log.constants.debug);
                    }
                    else if (!foundInExclude$Boolean) // Excluded items should not stop search
                    {
                        log.comment.write("Stopping search for nouns parts of speech because different part of speech found:", log.constants.debug);
                        log.comment.write("currentPartOfSpeech$String: " + currentPartOfSpeech$String, log.constants.debug);
                        log.comment.write("specificNounPartOfSpeech$String: " + specificNounPartOfSpeech$String, log.constants.debug);

                        break;
                    }
                }
                else
                {
                    log.comment.write("Different noun types are not allowed", log.constants.debug);

                    let foundSamePartOfSpeech$Boolean = test.value.equal$String(currentPartOfSpeech$String, specificNounPartOfSpeech$String);

                    if (!foundSamePartOfSpeech$Boolean)
                        foundSamePartOfSpeech$Boolean = test.value.contains$String(currentPartOfSpeech$String, specificNounPartOfSpeech$String);

                    let foundAdjectiveOfAnyType$Boolean = test.value.contains$String(currentPartOfSpeech$String, grammar.constants.partsOfSpeech.adjective.name);

                    log.comment.write("Checking specificNounPartOfSpeech$String '" + specificNounPartOfSpeech$String + "'", log.constants.debug);
                    log.comment.write("foundSamePartOfSpeech$Boolean: " + foundSamePartOfSpeech$Boolean, log.constants.debug);
                    log.comment.write("foundAdjectiveOfAnyType$Boolean: " + foundAdjectiveOfAnyType$Boolean, log.constants.debug);

                    if (foundSamePartOfSpeech$Boolean)
                    {
                        specificNounPartOfSpeech$String = currentPartOfSpeech$String;
                        log.value.write("Found noun part of speech specificNounPartOfSpeech$String:", specificNounPartOfSpeech$String, log.constants.debug);

                        result$ArrayDictionary.push(tokens$ArrayDictionary[i]);
                        log.value.write("Pushed noun into result$ArrayDictionary:", result$ArrayDictionary, log.constants.debug);
                    }
                    else if (foundAdjectiveOfAnyType$Boolean)
                    {
                        result$ArrayDictionary.push(tokens$ArrayDictionary[i]);
                        log.value.write("Pushed adjective into result$ArrayDictionary:", result$ArrayDictionary, log.constants.debug);
                    }
                    else
                    {
                        log.comment.write("Stopping search for nouns parts of speech because different part of speech found:", log.constants.debug);
                        log.comment.write("currentPartOfSpeech$String: " + currentPartOfSpeech$String, log.constants.debug);
                        log.comment.write("specificNounPartOfSpeech$String: " + specificNounPartOfSpeech$String, log.constants.debug);

                        break;
                    }
                }
            }
        }

        log.function.return("Returning result$ArrayDictionary from nextNounPhrase:", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

    nextObject(tokens$ArrayDictionary, index$Integer = 0)
    {
        let result$Dictionary = {};

        log.value.write("Tokens to search for prepositional object as tokens$ArrayDictionary", tokens$ArrayDictionary, log.constants.debug);

        if (test.assertion.notEmpty$Array(tokens$ArrayDictionary))
        {
            for (let i = index$Integer; i < tokens$ArrayDictionary.length; i++)
            {
                let token$Dictionary = tokens$ArrayDictionary[i];
                if (test.assertion.hasKey(token$Dictionary, grammar.constants.database.part_of_speech_variable))
                {
                    if (test.value.contains$String(token$Dictionary[grammar.constants.database.part_of_speech_variable], grammar.constants.partsOfSpeech.object.name))
                    {
                        result$Dictionary = token$Dictionary;
                        break;
                    }
                }
            }
        }

        return result$Dictionary;
    }

};

module.exports = parsingFunctions;