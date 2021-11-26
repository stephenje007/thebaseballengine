"use strict";

const log        = require('../log');
const grammar   = require('./');
const test       = require('../test');
const text       = require('../text');

const util       = require('util');

let tokenFunctions = {

    addTokensForStringsThatOccurMoreThanOnce(text$String, tokens$ArrayDictionary)
    {
        log.function.write("Add tokens for text that occurs more than once", log.constants.debug);

        let result$ArrayDictionary = [];
        let resultsToConcatenate$ArrayDictionary = [];

        if (test.value.notEmpty$Array(tokens$ArrayDictionary))
        {
            for (let i = 0; i < tokens$ArrayDictionary.length; i++)
            {
                let currentToken$String = tokens$ArrayDictionary[i][grammar.constants.database.token_string_variable];
                log.value.write("Current token as currentToken$String", currentToken$String, log.constants.debug);

                let occurrences$ArrayInteger = text.find.tokenPositionsWithinString(text$String, currentToken$String);
                log.value.write("Token appears in string at these positions as occurrences$ArrayInteger", occurrences$ArrayInteger, log.constants.debug);

                if (test.value.numberOfItems$Array(occurrences$ArrayInteger) > 1)
                {
                    for (let j = 0; j < occurrences$ArrayInteger.length; j++)
                    {
                        let tokenToInsert$Dictionary = {};
                        Object.assign(tokenToInsert$Dictionary, tokens$ArrayDictionary[i]);

                        if (!test.value.contains$String(tokens$ArrayDictionary[i][grammar.constants.database.part_of_speech_variable], grammar.constants.partsOfSpeech.number.name))
                        {
                            // Note: Numbers should not be added again
                            let firstPosition$Integer = occurrences$ArrayInteger[j] + 1; // String positions from database start at 1, not 0; numbers are not found in the database, so they do not require an offset
                            log.value.write("firstPosition$Integer becomes a misnomer after adding other occurences", firstPosition$Integer, log.constants.debug);

                            tokenToInsert$Dictionary[grammar.constants.database.string_position_variable] = firstPosition$Integer;
                            log.value.write("Token with updated position, to insert as tokenToInsert$Dictionary", tokenToInsert$Dictionary, log.constants.debug);

                            resultsToConcatenate$ArrayDictionary.push(tokenToInsert$Dictionary);
                            log.value.write("Adding token to resultsToConcatenate$ArrayDictionary", resultsToConcatenate$ArrayDictionary, log.constants.debug);
                        }
                    }
                }
            }
        }

        result$ArrayDictionary = tokens$ArrayDictionary.concat(resultsToConcatenate$ArrayDictionary);

        log.function.return("Returning result$ArrayDictionary from addTokensForStringsThatOccurMoreThanOnce", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

    removeTokensByComparingStrings(tokens$ArrayDictionary, tokensToRemove$ArrayDictionary, propertyToCompare$String)
    {
        log.function.write("Removing duplicate tokens", log.constants.debug);

        let result$ArrayDictionary = [];

        if (test.value.empty$Array(tokensToRemove$ArrayDictionary))
        {
            result$ArrayDictionary = tokens$ArrayDictionary;
        }
        else if (test.value.notEmpty$Array(tokens$ArrayDictionary))
        {
            for (let i = 0; i < tokens$ArrayDictionary.length; i++)
            {
                let currentValue$String = tokens$ArrayDictionary[i][propertyToCompare$String];
                let removeCurrentElement$Boolean = false;
                for (let j = 0; j < tokensToRemove$ArrayDictionary.length; j++)
                {
                    let currentComparison$String = tokensToRemove$ArrayDictionary[j][propertyToCompare$String];
                    if (test.value.equal$String(currentValue$String, currentComparison$String))
                        removeCurrentElement$Boolean = true;
                }

                if (!removeCurrentElement$Boolean) result$ArrayDictionary.push(tokens$ArrayDictionary[i]);
            }
        }

        log.function.return("Returning result$ArrayDictionary from removeTokens", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

    removeOverlappingTokens(text$String, tokens$ArrayDictionary)
    {
        log.function.write("Removing duplicate tokens", log.constants.debug);

        log.value.write("Original text as text$String: ", text$String, log.constants.debug);
        log.value.write("Original array as tokens$ArrayDictionary: ", tokens$ArrayDictionary, log.constants.debug);

        let result$ArrayDictionary = [];

        if (test.assertion.notEmpty$Array(tokens$ArrayDictionary))
        {
            let elementsToRemove$SetInteger = new Set();
            let elementsToPreserve$SetInteger = new Set();
            for (let i = 0; i < tokens$ArrayDictionary.length; i++)
            {
                if (test.value.notEmpty$Dictionary(tokens$ArrayDictionary[i]))
                {
                    log.comment.write("\nToken to test:\n", log.constants.debug);

                    let token1$Dictionary = tokens$ArrayDictionary[i];
                    log.value.write("token1$Dictionary", token1$Dictionary, log.constants.debug);

                    let token1$String = token1$Dictionary[grammar.constants.database.token_string_variable];
                    log.value.write("Token to compare as token1$String", token1$String, log.constants.debug);

                    for (let j = 0; j < tokens$ArrayDictionary.length; j++)
                    {
                        if
                        (
                            i !== j &&
                            !elementsToPreserve$SetInteger.has(j) &&
                            test.assertion.notEmpty$Dictionary(tokens$ArrayDictionary[i]) &&
                            test.assertion.notEmpty$Dictionary(tokens$ArrayDictionary[j])
                        )
                        {
                            log.comment.write("\nTesting token1$String against new token:\n", log.constants.debug);

                            let token2$Dictionary = tokens$ArrayDictionary[j];
                            log.value.write("token2$Dictionary", token2$Dictionary, log.constants.debug);

                            let token2$String = token2$Dictionary[grammar.constants.database.token_string_variable];
                            log.value.write("Token to compare as token2$String", token2$String, log.constants.debug);

                            let token1ContainsToken2$Boolean = test.value.contains$String(token1$String, token2$String);
                            log.value.write("token1ContainsToken2$Boolean", token1ContainsToken2$Boolean, log.constants.debug);

                            if (token1ContainsToken2$Boolean)
                            {
                                let tokenStringsAreEqual$Boolean = test.value.equal$String(token1$String, token2$String);
                                log.value.write("tokenStringsAreEqual$Boolean", tokenStringsAreEqual$Boolean, log.constants.debug);

                                let token1PartOfSpeech$String = tokens$ArrayDictionary[i][grammar.constants.database.part_of_speech_variable];
                                log.value.write("token1PartOfSpeech$String", token1PartOfSpeech$String, log.constants.debug);

                                let token2PartOfSpeech$String = tokens$ArrayDictionary[j][grammar.constants.database.part_of_speech_variable];
                                log.value.write("token2PartOfSpeech$String", token2PartOfSpeech$String, log.constants.debug);

                                let tokenTypesAreEqual$Boolean = test.value.equal$String(token1PartOfSpeech$String, token2PartOfSpeech$String);
                                log.value.write("tokenTypesAreEqual$Boolean", tokenTypesAreEqual$Boolean, log.constants.debug);

                                log.comment.write("Do not remove numbers or dates as duplicates. They are not found using INSTR, so they will not be substrings", log.constants.debug);

                                if
                                (
                                    // !test.value.contains$String(token1PartOfSpeech$String, grammar.constants.database.noun_math_number) &&
                                    // !test.value.contains$String(token1PartOfSpeech$String, grammar.constants.database.noun_math_date) &&
                                    !(test.value.equal$String(token2PartOfSpeech$String, grammar.constants.partsOfSpeech.noun_math_number.name) ||
                                    test.value.equal$String(token2PartOfSpeech$String, grammar.constants.partsOfSpeech.noun_math_date.name))
                                )
                                {
                                    elementsToPreserve$SetInteger.add(i);
                                    elementsToRemove$SetInteger.add(j);
                                    log.comment.write("String positions are: " + token1$Dictionary[grammar.constants.database.string_position_variable] + ", " + token2$Dictionary[grammar.constants.database.string_position_variable], log.constants.debug);
                                    log.value.write("Marking element for removal", elementsToRemove$SetInteger, log.constants.debug);
                                }
                                // if (tokenStringsAreEqual$Boolean)
                                // {
                                //     log.comment.write("Token strings are equal, checking if their positions are the same. If so, mark for removal", log.constants.debug);
                                //     if (token1$Dictionary[grammar.constants.database.string_position_variable] === token2$Dictionary[grammar.constants.database.string_position_variable])
                                //     {
                                //         elementsToPreserve$SetInteger.add(i);
                                //         elementsToRemove$SetInteger.add(j);
                                //         log.comment.write("String positions are: " + token1$Dictionary[grammar.constants.database.string_position_variable] + ", " + token2$Dictionary[grammar.constants.database.string_position_variable], log.constants.debug);
                                //         log.value.write("Marking element for removal", elementsToRemove$SetInteger, log.constants.debug);
                                    // }
                                // }
                                // else
                                // {
                                //     log.comment.write("Check if token1 contains token2 as a substring or a token. If not token, then mark element for removal", log.constants.debug);
                                //     // log.comment.write("Check if token1 contains token2 as a substring or a token. If token, then mark element for removal", log.constants.debug);
                                //
                                //     let positions$ArrayInteger = text.find.tokenPositionsWithinString(token1$String, token2$String);
                                //     log.value.write("token1$String: '" + token1$String + "', token2$String: '" + token2$String + "', positions$ArrayInteger", positions$ArrayInteger, log.constants.debug);
                                //
                                //     if (test.value.notEmpty$Array(positions$ArrayInteger))
                                //     {
                                //         elementsToPreserve$SetInteger.add(i);
                                //         elementsToRemove$SetInteger.add(j);
                                //         log.value.write("Marking element for removal", token1$Dictionary, log.constants.debug);
                                //         log.value.write("Marking element for removal", elementsToRemove$SetInteger, log.constants.debug);
                                //     }
                                // }
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < tokens$ArrayDictionary.length; i++)
            {
                if (!elementsToRemove$SetInteger.has(i))
                    result$ArrayDictionary.push(tokens$ArrayDictionary[i]);
            }
        }

        log.function.return("Returning tokens$ArrayDictionary from removeOverlappingTokens", result$ArrayDictionary, log.constants.debug);
        return result$ArrayDictionary;
    },

};

module.exports = tokenFunctions;