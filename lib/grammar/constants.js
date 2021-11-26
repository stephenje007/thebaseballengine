"use strict";

let database = {

    tokens_table                    : "_Tokens",
    token_lookup_column             : "tokenString",
    token_string_variable           : "token$String",

    part_of_speech_lookup_column    : "partOfSpeech",
    part_of_speech_variable         : "partOfSpeech$String",
    parts_of_speech_variable        : "partOfSpeech$ArrayString",

    json_definition_lookup_column   : "definition",
    json_definition_variable        : "jsonDefinition$StringToJsonParse",

    language_lookup_column          : "language",
    language_variable               : "language$String",

    database_locations_variable     : "databaseLocations$ArrayDictionary",
    database_name_variable          : "databaseName$String",
    table_name_variable             : "tableName$String",
    column_name_variable            : "columnName$String",

    // unique_key_variable             : "uniqueKey$StringOrNumber",
    unique_keys_variable            : "uniqueKeys$ArrayDictionary",
    foreign_key_variable            : "foreignKeys$ArrayDictionary",
    string_position_variable        : "firstPosition$Integer",
    alias_variable                  : "alias$String",

    lookup_variable_delineator      : "^",
};

module.exports.database = database;

let partsOfSpeech = {

    "interrogative"                 : { "name": "interrogative" },
    "adjective"                     : { "name": "adjective" },
    "noun"                          : { "name": "noun" },
    "aggregate"                     : { "name": "aggregate" },
    "comparison"                    : { "name": "comparison" },
    "preposition"                   : { "name": "preposition" },
    "number"                        : { "name": "number" },
    "object"                        : { "name": "_object" },

    "noun_aggregate"                : { "name": "noun_aggregate" },
    "noun_math_date"                : { "name": "noun_math_date", "regex": /[0-9]*[-/]?[0-9]*[-/][0-9]{4}/gi },
    "noun_math_number"              : { "name": "noun_math_number", "regex": /[[+-]?\d+(?:\.\d+)?/gi },

    "comparison_greater"            : { "name": "comparison_greater" },
    "comparison_less"               : { "name": "comparison_less" },
    "preposition_start_range"       : { "name": "preposition_start_range" },
    "preposition_end_range"         : { "name": "preposition_end_range" },
    "preposition_start_list"        : { "name": "preposition_start_list" },


};

module.exports.partsOfSpeech = partsOfSpeech;
