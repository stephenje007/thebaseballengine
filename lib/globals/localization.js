"use strict";

const globals   = require('.');
const log       = require('../log');
const test      = require('../test');

let dashboard = {

    title   : {
        english     : "Ability7 Pre-Release Dashboard: ",
        spanish     : "Panel de prelanzamiento Ability7: ",
        french      : "Tableau de bord de prédilection Ability7: ",
        italian     : "Ability7 Dashboard pre-rilascio: "
    },

    menu_insert     : {
        english     : "Add a New Record",
        spanish     : "Añadir un nuevo registro",
        french      : "Ajouter un nouvel enregistrement",
        italian     : "Aggiungi un nuovo record"
    }

};

module.exports.dashboard = dashboard;

let authentication = {

    logged_out  : {
        english     : "You've been logged out. Thank you for using Ability7!",
        french      : "Vous avez été déconnecté. Merci d'utiliser Ability7!",
        italian     : "Sei stato disconnesso. Grazie per aver usato Ability7!",
        spanish     : "Has sido desconectado. ¡Gracias por usar Ability7!",
    },

};

module.exports.authentication = authentication;


let ask = {

    instruction_dialog  : {
        english     : "<h1 align='center' style='font-size: 20px; padding: 0 0 20px 0; margin: 0;'><b>Welcome to <a href='https://thebaseballengine.com/'>The Baseball Engine</a></b></h1><p>This demonstration of natural language by <a href='https://abilityintelligence.com/'>Ability Intelligence</a> shows how to use regular sentences to get data from large databases." +
            "Ask it a question and send us your comments or requests at <a href='mailto:info@abilityintelligence.com?subject=The%20Baseball%20Engine'>info@abilityintelligence.com</a>.</p>" +
            "<p>Here are some curated examples:</p>" +
            "<p><a href='https://thebaseballengine.com/?question=Which+pitchers+had+more+than+50+wins%3F'>Which pitchers had more than 50 wins?</a><br />" +
            "<a href='https://thebaseballengine.com/?question=Which+hitters+had+more+than+175+RBIs%3F+Show+hits%2C+doubles%2C+and+triples+also.'>Which hitters had more than 175 RBIs? Show hits, doubles, and triples also.</a><br />" +
            "<a href='https://thebaseballengine.com/?question=Which+position+players+had+more+than+50+home+runs+after+the+year+1990%3F'>Which position players had more than 50 home runs after the year 1990?</a></p>" +
            "<p style='padding-bottom: 8px;'>Try some randomly generated questions:</p>",
        french      : "Posez-moi une question!",
        italian     : "Fammi una domanda!",
        spanish     : "¡Hazme una pregunta!",
    },

    result_dialog  : {
        english     : "You asked:",
        french      : "Vous avez demandé:",
        italian     : "Tu hai chiesto:",
        spanish     : "Usted preguntó:",
    },

    label_question  : {
        english     : "I'm listening:",
        french      : "J'écoute:",
        italian     : "Sto ascoltando:",
        spanish     : "Estoy escuchando:",
    },

    button_question  : {
        english     : "Send your question",
        french      : "Envoyez votre question",
        italian     : "Invia la tua domanda",
        spanish     : "Envíe su pregunta",
    },

    no_results  : {
        english     : "There were no results",
        french      : "Il n'y avait aucun résultat",
        italian     : "Non ci sono stati risultati",
        spanish     : "No hubo resultados",
    }

};

module.exports.ask = ask;

let form = {

    instructions_insert : {
        english     : "You can add a record to your database using this form.<br />Click the submit button at the bottom when you're finished.",
        french      : "Vous pouvez ajouter un enregistrement à votre base de données à l'aide de ce formulaire. <br /> Cliquez sur le bouton d'envoi en bas lorsque vous avez terminé.",
        italian     : "Puoi aggiungere un record al tuo database usando questo modulo. <br /> Fai clic sul pulsante di invio in basso quando hai finito.",
        spanish     : "Puede agregar un registro a su base de datos utilizando este formulario. <br /> Haga clic en el botón Enviar en la parte inferior cuando haya terminado.",
    },

    submit_button  : {
        english     : "Submit",
        french      : "Soumettre",
        italian     : "Invio",
        spanish     : "Enviar",
    },

    submit_successful  : {
        english     : "I added your record to the database. Here is a copy.",
        french      : "J'ai ajouté votre enregistrement à la base de données. Voici une copie.",
        italian     : "Ho aggiunto il tuo record al database. Ecco una copia.",
        spanish     : "Agregué tu registro a la base de datos. Aquí hay una copia.",
    },

    invalid_character : {
        english     : "I found a character I can't insert into the database.<br />It is the character |$character| in field '|$location|.'<br />Can you please check it and try again?",
        french      : "J'ai trouvé un caractère que je ne peux pas insérer dans la base de données. <br /> C'est le caractère |$character| dans le champ '|$location|.' <br /> Pouvez-vous s'il vous plaît vérifier et essayez à nouveau?",
        italian     : "Ho trovato un personaggio che non posso inserire nel database.<br />È il carattere |$character| nel campo '|$location|.' <br /> Puoi controllare e riprovare?",
        spanish     : "Encontré un carácter que no puedo insertar en la base de datos. <br /> Es el carácter |$character| en el campo '|$location|.' <br /> ¿Puede verificarlo e intentarlo de nuevo?",
    },

    create_account : {
        english     : "Create your account",
        spanish     : "Crea tu cuenta",
        french      : "Créez votre compte",
        italian     : "Crea il tuo account"
    },

    account_name : {
        english     : "Account name",
        french      : "Nom du compte",
        italian     : "Nome utente",
        spanish     : "Nombre de la cuenta",
    },

    password : {
        english     : "Password",
        french      : "Mot de passe",
        italian     : "Crea il tuo account",
        spanish     : "Contraseña",
    },

    new_password : {
        english     : "New password",
        french      : "Nouveau mot de passe",
        italian     : "Nuova password",
        spanish     : "Nueva contraseña",
    },


};

module.exports.form = form;

let error = {

    unexpected_error  : {
        english     : "I've run into an unexpected error. The error number is 500.",
        spanish     : "Me he encontrado con un error inesperado. El número de error es 500.",
        french      : "J'ai rencontré une erreur inattendue. Le numéro d'erreur est 500.",
        italian     : "Ho riscontrato un errore imprevisto. Il numero di errore è 500."
    },

};

module.exports.error = error;

let language = function(text$Dictionary, language$String = '')
{
    log.function.write("Printing text", log.constants.debug);
    let result$String = '';

    if (test.value.empty$String(language$String))
        language$String = global.currentLanguage$String;

    if (test.value.hasKey(text$Dictionary, language$String))
    {
        log.value.write("text$Dictionary: text to choose from", text$Dictionary, log.constants.debug);
        log.value.write("language$String: language to use", language$String, log.constants.debug);
        result$String = text$Dictionary[language$String];
    }

    log.function.return("Returning result$String from language", result$String, log.constants.debug);

    return result$String;
};

module.exports.language = language;

let allowedCharacters = {

    english: {
        uppercase               : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase               : "abcdefghijklmnopqrstuvwxyz",
        numbers                 : "0123456789",
        special_email           : "!#$%&*+-/=?_{}~.",
        special_field           : '" @:;[]%(),\'', // includes space
        special_database        : "_-",
    },

    french: { // placeholder
        uppercase               : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase               : "abcdefghijklmnopqrstuvwxyz",
        numbers                 : "0123456789",
        special_email           : "!#$%&*+-/=?_{}~.",
        special_field           : '" @:;[]%(),\'', // includes space
        special_database        : "_-",
    },

    italian: { // placeholder
        uppercase               : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase               : "abcdefghijklmnopqrstuvwxyz",
        numbers                 : "0123456789",
        special_email           : "!#$%&*+-/=?_{}~.",
        special_field           : '" @:;[]%(),\'', // includes space
        special_database        : "_-",
    },

    spanish: { // placeholder
        uppercase               : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase               : "abcdefghijklmnopqrstuvwxyz",
        numbers                 : "0123456789",
        special_email           : "!#$%&*+-/=?_{}~.",
        special_field           : '" @:;[]%(),\'', // includes space
        special_database        : "_-",
    },

};

module.exports.allowedCharacters = allowedCharacters;

let allowedCharacterSets = {  // todo: change to function so that special_ allowed characters will automatically be included

    all_delimiters    : this.allowedCharacters.english.special_email + this.allowedCharacters.english.special_field + this.allowedCharacters.english.special_database

};

module.exports.allowedCharacterSets = allowedCharacterSets;

let allAllowedCharacters = function(language$String = global.currentLanguage$String)
{
    log.function.write("List of all allowed characters in language: " + language$String, log.constants.debug);

    let result$String = '';
    for (let key$String in this.allowedCharacters[language$String])
    {
        result$String += this.allowedCharacters[language$String][key$String];
    }

    log.function.return("Returning result$String from allAllowedCharacters", result$String, log.constants.debug);
    return result$String;
};

module.exports.allAllowedCharacters = allAllowedCharacters;
