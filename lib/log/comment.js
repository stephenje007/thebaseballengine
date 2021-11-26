"use strict";

let commentFunctions =
{
    write(comment$String, print$Boolean = true, params$Dictionary = {})
    {
        if (print$Boolean)
        {
            console.log(comment$String);
        }
    }
}

module.exports = commentFunctions;