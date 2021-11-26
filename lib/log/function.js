const util = require('util');

const test = require('../test');

let functionFunctions =
{
    write(comment$String, print$Boolean = true, params$Dictionary = {})
    {
        if (print$Boolean)
        {
            let stack = new Error().stack;
            let caller$String = stack.split('\n')[2]
                .trim()
                .replace('at ', '');

            let positionOfFirstParen$Integer = caller$String.indexOf('(');
            let function$String = caller$String.substring(0, positionOfFirstParen$Integer);

            if (test.value.notEmpty$String(function$String))
            {
                caller$String = function$String + '\nat ' + caller$String.substring(positionOfFirstParen$Integer)
                    .replace('(', '')
                    .replace(')', '');
            }
            else
            {
                caller$String = '(Inline statements)\nat ' + caller$String.substring(positionOfFirstParen$Integer)
                    .replace('(', '')
                    .replace(')', '');
            }

            console.log("*********************************************************************************************************");
            if (test.value.notEmpty$String(comment$String)) console.log(comment$String);
            if (test.value.notEmpty$String(caller$String)) console.log(caller$String);
            console.log("*********************************************************************************************************");
        }
    },

    return(comment$String, object$Object, print$Boolean = true, params$Dictionary = {})
    {
        if (print$Boolean)
        {
            let stack = new Error().stack;
            let caller$String = stack.split('\n')[2]
                .trim()
                .replace('at ', '');

            let positionOfFirstParen$Integer = caller$String.indexOf('(');
            let function$String = caller$String.substring(0, positionOfFirstParen$Integer);

            if (test.value.notEmpty$String(function$String))
            {
                caller$String = function$String + '\nat ' + caller$String.substring(positionOfFirstParen$Integer)
                    .replace('(', '')
                    .replace(')', '');
            }
            else
            {
                caller$String = '(Inline statements)\nat ' + caller$String.substring(positionOfFirstParen$Integer)
                    .replace('(', '')
                    .replace(')', '');
            }

            console.log("=========================================================================================================");
            if (test.value.notEmpty$String(comment$String)) console.log(comment$String);
            if (test.value.notEmpty$String(caller$String)) console.log(caller$String);
            console.log(util.inspect(object$Object));
            console.log("=========================================================================================================");
        }
    }
};

module.exports = functionFunctions;