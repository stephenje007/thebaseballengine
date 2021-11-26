"use strict";

const grammar = require('../grammar');
const log = require('../log');
const test = require('../test');

let languageFunctions = {

    set(request$ExpressRequestDictionary, language$String)
    {
        log.function.write("Set session language", log.constants.debug);
        if(test.value.empty$String(request$ExpressRequestDictionary.session.language$String))
        {
            request$ExpressRequestDictionary.session.language$String = global.currentLanguage$String;
            log.value.write("Setting session language to global default because no current session language is set", request$ExpressRequestDictionary.session.language$String, log.constants.debug);
        }
        else if(test.value.notEmpty$String(language$String))
        {
            request$ExpressRequestDictionary.session.language$String = language$String;
            log.value.write("Setting session language to language$String parameter", request$ExpressRequestDictionary.session.language$String, log.constants.debug);
            // todo: replace with grammar.constants.language_variable
        }
    },

    get(request$ExpressRequestDictionary)
    {
        let result$String = global.currentLanguage$String;

        if (test.value.notEmpty$Dictionary(request$ExpressRequestDictionary) && test.value.hasKey(request$ExpressRequestDictionary, 'session'))
        {
            if (test.value.hasKey(request$ExpressRequestDictionary.session, grammar.constants.database.language_variable))
            {
                result$String = request$ExpressRequestDictionary.session[grammar.constants.database.language_variable];
            }
        }

        return result$String;
    }

}; module.exports = languageFunctions;