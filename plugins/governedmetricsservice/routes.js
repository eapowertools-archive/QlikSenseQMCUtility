var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended:false});
var fs = require('fs');

router.route('/gms')
.get(function(request,response)
{
    response.send('Hello World');
})

module.exports = router;
