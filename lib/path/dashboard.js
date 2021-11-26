"use strict";

const account    = require('../account');
const chart      = require('../chart');
const database   = require('../database');
const file       = require('../file');
const form       = require('../form');
const globals    = require('../globals');
const grammar    = require('../grammar');
const html       = require('../html');
const log        = require('../log');
const path       = require('.');
const report     = require('../report');
const test       = require('../test');
const text       = require('../text');
const value      = require('../value');

const util       = require('util');

const formidable = require('formidable');
const express    = require('express');
const router     = express.Router();

module.exports = function()
{
    function generateNumber(firstNumber$Integer = 0, lastNumber$Integer = 0)
    {
        return Math.floor(Math.random() * (lastNumber$Integer - firstNumber$Integer)) + lastNumber$Integer;
    }

    function generateYear(firstYear$Integer = 1872, lastYear$Integer = 2018)
    {
        return Math.floor(Math.random() * (lastYear$Integer - firstYear$Integer)) + 1872;
    }

    function convertQuestionToHTML(question$String)
    {
        let result$String = '';

        let urlEncoded$String = question$String.replace(/ /g, '+');
        // let html$String = '<a href="https://thebaseballengine.com/?question=' + urlEncoded$String + '">' + question$String + '</a>';
        let html$String = '<a href="/?question=' + urlEncoded$String + '">' + question$String + '</a>';

        result$String = html$String;
        return result$String;
    }

    function generateRandomQuestions(numberOfQuestions$Integer, language$String = globals.constants.vocabulary.english)
    {
        log.function.write("Create random questions and generate their links", log.constants.debug);

        let result$String = '';

        for (let i = 0; i < numberOfQuestions$Integer; i++)
        {
            let optionsQuestionWords$ArrayString = ['Which players', 'Which position players', 'Which hitters', 'Which pitchers'];
            let choiceOptionQuestionWords$Integer = Math.floor(Math.random() * optionsQuestionWords$ArrayString.length);
            log.value.write("choiceOptionQuestionWords$Integer", choiceOptionQuestionWords$Integer, log.constants.debug);

            let question$String = '';

            question$String += optionsQuestionWords$ArrayString[choiceOptionQuestionWords$Integer] + ' had ';
            log.value.write("Current question state " + i + " (stage 1: generated question words): ", question$String, log.constants.debug);

            let optionsComparison$ArrayString = ['more than', 'fewer than'];
            let choiceOptionComparison$Integer = Math.floor(Math.random() * optionsComparison$ArrayString.length);
            question$String += optionsComparison$ArrayString[choiceOptionComparison$Integer] + ' ';
            log.value.write("Current question state " + i + " (stage 2: created comparison): ", question$String, log.constants.debug);

            let min$Integer = 0;
            let lowerRange$Integer = 0;
            let upperRange$Integer = 0;
            let max$Integer = 0;
            let option$String = '';
            let value$Integer = 0;
            if (choiceOptionQuestionWords$Integer <= 2)
            {
                let optionsPositionPlayers$ArrayString = ['at bats', 'runs', 'hits', 'doubles', 'triples', 'homers', 'RBIs', 'stolen bases'];
                let choiceOptionPositionPlayers$Integer = Math.floor(Math.random() * optionsPositionPlayers$ArrayString.length);
                log.value.write("choiceOptionPositionPlayers$Integer", choiceOptionPositionPlayers$Integer, log.constants.debug);

                let phraseChosenForPositionPlayers$String = optionsPositionPlayers$ArrayString[choiceOptionPositionPlayers$Integer];
                log.value.write("phraseChosenForPositionPlayers$String", phraseChosenForPositionPlayers$String, log.constants.debug);

                if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'at bats'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 100;
                    upperRange$Integer = 200;
                    max$Integer = 716;
                } else if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'runs'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 40;
                    upperRange$Integer = 90;
                    max$Integer = 198;
                } else if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'hits'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 30;
                    upperRange$Integer = 70;
                    max$Integer = 262;
                } else if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'doubles'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 20;
                    upperRange$Integer = 30;
                    max$Integer = 67;
                } else if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'triples'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 5;
                    upperRange$Integer = 15;
                    max$Integer = 36;
                } else if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'homers'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 30;
                    upperRange$Integer = 40;
                    max$Integer = 73;
                } else if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'RBIs'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 30;
                    upperRange$Integer = 70;
                    max$Integer = 191;
                } else if (test.value.equal$String(phraseChosenForPositionPlayers$String, 'stolen bases'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 10;
                    upperRange$Integer = 25;
                    max$Integer = 138;
                }
                // else if(test.value.equal$String(phraseChosenForPositionPlayers$String, 'walks'))
                // {
                //     min$Integer = 0;
                //     lowerRange$Integer = 25;
                //     upperRange$Integer = 40;
                //     max$Integer = 232;
                // }
                // else if(test.value.equal$String(phraseChosenForPositionPlayers$String, 'strike outs'))
                // {
                //     min$Integer = 0;
                //     lowerRange$Integer = 30;
                //     upperRange$Integer = 50;
                //     max$Integer = 223;
                // }
                else
                {
                    log.comment.write("Position Players: This condition should not happen.", log.constants.debug);
                }

                value$Integer = generateNumber(lowerRange$Integer, upperRange$Integer);
                log.value.write("value$Integer", value$Integer, log.constants.debug);

                question$String += value$Integer + ' ' + phraseChosenForPositionPlayers$String;
                log.value.write("Current question state " + i + " (stage 3: generate numbers for position players): ", question$String, log.constants.debug);
            } else if (choiceOptionQuestionWords$Integer === 3)
            {
                let optionsPitchers$ArrayString = ['wins', 'losses', 'saves', 'complete games', 'strikeouts', 'walks'];
                let choicePitchers$Integer = Math.floor(Math.random() * (optionsPitchers$ArrayString.length - 1));
                log.value.write("choicePitchers$Integer", choicePitchers$Integer, log.constants.debug);

                let wordChosenForPitchers$String = optionsPitchers$ArrayString[choicePitchers$Integer];
                log.value.write("wordChosenForPitchers$String", wordChosenForPitchers$String, log.constants.debug);

                if (test.value.equal$String(wordChosenForPitchers$String, 'wins'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 10;
                    upperRange$Integer = 20;
                    max$Integer = 60;
                } else if (test.value.equal$String(wordChosenForPitchers$String, 'losses'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 5;
                    upperRange$Integer = 15;
                    max$Integer = 48;
                } else if (test.value.equal$String(wordChosenForPitchers$String, 'saves'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 10;
                    upperRange$Integer = 20;
                    max$Integer = 75;
                } else if (test.value.equal$String(wordChosenForPitchers$String, 'complete games'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 5;
                    upperRange$Integer = 15;
                    max$Integer = 75;
                }
                // else if(test.value.equal$String(wordChosenForPitchers$String, 'earned runs'))
                // {
                //     min$Integer = 0;
                //     lowerRange$Integer = 50;
                //     upperRange$Integer = 100;
                //     max$Integer = 291;
                // }
                else if (test.value.equal$String(wordChosenForPitchers$String, 'strikeouts'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 30;
                    upperRange$Integer = 100;
                    max$Integer = 513;
                } else if (test.value.equal$String(wordChosenForPitchers$String, 'walks'))
                {
                    min$Integer = 0;
                    lowerRange$Integer = 30;
                    upperRange$Integer = 50;
                    max$Integer = 289;
                } else
                {
                    log.comment.write("Pitchers: This condition should not happen.", log.constants.debug);
                }

                value$Integer = generateNumber(lowerRange$Integer, upperRange$Integer);
                log.value.write("value$Integer", value$Integer, log.constants.debug);

                question$String += value$Integer + ' ' + wordChosenForPitchers$String;
                log.value.write("Current question state " + i + " (stage 3: generate numbers for pitchers): ", question$String, log.constants.debug);


            } else
            {
                log.comment.write("Neither position players, nor pitchers: This condition should not happen.", log.constants.debug);
            }

            let choicePrepositionalPhrase$Integer = Math.floor(Math.random() * 6);
            switch (choicePrepositionalPhrase$Integer)
            {
                case 0: // no year
                    question$String += '';
                    break;
                case 1:
                    question$String += ' before year ' + generateYear();
                    break;
                case 2: // after the year
                    question$String += ' after year ' + generateYear();
                    break;
                case 3: // between the years
                    let year1$Integer = generateYear();
                    let year2$Integer = generateYear();
                    if (year1$Integer > year2$Integer)
                    {
                        let temporaryYear$Integer = year1$Integer;
                        year1$Integer = year2$Integer;
                        year2$Integer = temporaryYear$Integer;
                    }
                    question$String += ' between years ' + year1$Integer + ' and ' + year2$Integer;
                    break;
                case 4: // in
                    question$String += ' in year ' + generateYear();
                    break;
                case 5: // during
                    question$String += ' during year ' + generateYear();
                    break;
                default:
            }

            log.value.write("Current question state " + i + " (stage 4: created preposition for year): ", question$String, log.constants.debug);

            question$String += "?";
            let html$String = convertQuestionToHTML(question$String);

            result$String += html$String;
            log.value.write("Current result$String " + i + ": ", result$String, log.constants.debug);
        }

        log.function.return("Returning result$String from generateRandomQuestion", result$String, log.constants.debug);
        return result$String;
    }

    router.param
    (
        'table',
        function (request, response, next, tableName$String)
        {
            request.tableName$String = tableName$String;
            next();
        }
    );

    router.param
    (
        'action',
        function (request, response, next, actionName$String)
        {
            request.actionName$String = "/" + actionName$String;
            next();
        }
    );

    router.param
    (
        'rowID',
        function(request, response, next, rowID$Integer)
        {
            request.rowID$Integer = rowID$Integer;
            next();
        }
    );

    router.param
    (
        'secondAction',
        function(request, response, next, secondActionName$String)
        {
            request.secondActionName$String = secondActionName$String;
            next();
        }
    );

    router.param
    (
        'confirmationCode',
        function(request, response, next, confirmationCode$String)
        {
            request.confirmationCode$String = confirmationCode$String;
            next();
        }
    );

    router.get (
        '/',
        function(request, response, next)
        {
            log.function.write("Set session language here", log.constants.debug);
            // todo
            next();
        }
    );

    router.get
    (
        '/:account?/:table?/:action?/:rowID?/:secondAction?/:confirmationCode?',
        function(request, response)
        {
            globals.language.set(request);

            log.function.write("Received get request with account and table parameters", log.constants.debug);
            log.value.write("request.accountName$String: user account name", request.accountName$String, log.constants.debug);
            log.value.write("request.tableName$String: database table name being requested", request.tableName$String, log.constants.debug);
            log.value.write("request.actionName$String: part of dashboard to access ", request.actionName$String, log.constants.debug);
            log.value.write("request.rowID$Integer: row of database table to access", request.rowID$Integer, log.constants.debug);
            log.value.write("request.secondActionName$String: action to be taken on row", request.secondActionName$String, log.constants.debug);
            log.value.write("request.confirmationCode$String: confirmation code for action to be taken", request.confirmationCode$String, log.constants.debug);
            log.value.write("request.databaseName$String: database name for this account", request.databaseName$String, log.constants.debug);

            let html$ArrayPromise = [];
            let alternateHeader$Boolean = false;
            let noHeader$Boolean = false;

            let tablePath$String = "/" + request.tableName$String;

            log.value.write("Current language", request.session[grammar.constants.database.language_variable], log.constants.debug);

            log.comment.write("Test if asking a question", log.constants.debug);
            let query$String = request.query.question;
            let includeRandomQuestions$String = globals.text(globals.localization.ask.instruction_dialog, globals.language.get(request)) + ' ' + generateRandomQuestions(3, globals.language.get(request));
            if (test.value.empty$String(query$String))
            {
                log.value.write("Current language", request.session[grammar.constants.database.language_variable], log.constants.debug);

                html$ArrayPromise.push(html.components.box(includeRandomQuestions$String));
                html$ArrayPromise.push(html.components.box(form.ask.generateHTML(request)));
            }
            else
            {
                log.value.write("Current language", request.session[grammar.constants.database.language_variable], log.constants.debug);
                let html$String = '';
                html$ArrayPromise.push(html.components.box(includeRandomQuestions$String));
                html$String += html.components.box(form.ask.generateHTML(request, query$String));
                html$ArrayPromise.push
                (
                    grammar.respond.to.text
                    (
                        query$String,
                        '__user_292720025', // To-do: Find which database and replace with the name
                        request
                    )
                        .then(
                            (results$ArrayDictionary) =>
                            {
                                if (test.value.notEmpty$Array(results$ArrayDictionary))
                                {
                                    html$String += html.components.box(value.convert.toCSSGridFromArrayDictionary(results$ArrayDictionary));
                                } else
                                {
                                    html$String += html.components.box((globals.text(globals.localization.ask.no_results, globals.language.get(request))));
                                }
                                return html$String;
                            }
                        )
                        .catch(
                            (error$Error) =>
                            {
                                html$String += html.components.box("Please try rephrasing your question");
                                return html$String;
                            }
                        )
                        .finally(
                            () =>
                            {
                                return html$String;
                            }
                        )
                );
            }

            html.page.render(response, '', html$ArrayPromise);
        }
    );

    return router;
};