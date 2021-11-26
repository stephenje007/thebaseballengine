"use strict";

const path = require('.');
const form = require('../form');
const html = require('../html');

const express = require('express');
const router = express.Router();

module.exports = function()
{
    router.get(path.constants.route.home,

        function(request, response)
        {
            response.send(file.spreadsheet.upload());
        }
    );

    return router;
};