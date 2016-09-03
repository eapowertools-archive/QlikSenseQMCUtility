var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var fs = require('fs');
var qrsInteract = require('qrs-interact');



module.exports = router;