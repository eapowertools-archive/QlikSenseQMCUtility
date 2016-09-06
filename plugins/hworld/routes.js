var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended:false});
var config = require('./config');
var fs = require('fs');

router.route('/hworld')
.get(function(request,response)
{
    response.send('Hello World');
})

module.exports = router;
