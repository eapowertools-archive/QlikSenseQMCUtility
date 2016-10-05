var path = require('path');
var fs = require('fs');
var extend = require('extend');

var configPath = path.join(__dirname,'/../config/');
var dir = fs.readdirSync(configPath);
dir.forEach(function(file)
{
    if(file==='installConfig.js')
    {
        var installConfig = require('./installConfig');
    }
})