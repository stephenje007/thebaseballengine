"use strict";

const test = require('.');

let assertionFunctions = {

    hasKey(object, property$String)
    {
        return test.value.hasKey(object,property$String);
    },

    notEmpty$Object(object)
    {
        return test.value.notEmpty$Object(object);
    },

    notEmpty$String(string)
    {
        return test.value.notEmpty$String(string);
    },

    inBounds$Array(array, index)
    {
        return test.value.inBounds$Array(array, index);
    },

    notEmpty$Array(array)
    {
        return test.value.notEmpty$Array(array);
    },

    notEmpty$Dictionary(obj)
    {
        return test.value.notEmpty$Dictionary(obj);
    },

    notEmpty$Integer(array)
    {
        return test.value.notEmpty$Integer(array);
    },

    is$Dictionary(obj)
    {
        return test.value.is$Dictionary(obj);
    },

    is$Integer(obj)
    {
        return test.value.is$Integer(obj);
    },

    is$KeyValuePair(obj)
    {
        return test.value.is$KeyValuePair(obj);
    },

    numberOfItems$Array(obj)
    {
        return test.value.numberOfItems$Array(obj);
    },

    numberOfItems$Dictionary(obj)
    {
        return test.value.numberOfItems$Dictionary(obj);
    },

};

module.exports = assertionFunctions;