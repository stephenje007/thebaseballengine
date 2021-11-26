"use strict";

const util = require('util');

let valueFunctions =
{
    write(comment$String, object$Object, print$Boolean = true, params$Dictionary = {})
    {
        if (print$Boolean)
        {
            console.log(comment$String);
            console.log(util.inspect(object$Object));
        }
    }
};

module.exports = valueFunctions;