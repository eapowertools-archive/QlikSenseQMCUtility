var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var winston = require('winston');
var config = require('../config/config');
var fs = require('fs');
var cookie = require('./getVPCookieNames');

var prefix;
var cookieName;
var cookieCheckInfo;

//set up logging
var logger = new (winston.Logger)({
	level: config.logging.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: config.logging.logFile})
    ]
});

router.use(cookieParser())
router.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var cookieArray = []; 
cookie.cookieNames()
.then(function(result)
{
    //console.log(result);
    return cookieArray = result;
})
.then(function()
{
    router.use(function(req, res, next)
    {
        //capture the path and evaluate against the virtual proxy array.
        //set some booleans that can be used in some 
        // console.log("URL:" + req.baseUrl);
        // console.log("PATH:" + req.path);
        if(cookieExists(req.cookies,"vp"))
        {
            cookieCheckInfo = filterCookies(cookieArray,req.cookies.vp);
        }
        else
        {
            var splitPath = req.path.split('/');
            cookieCheckInfo = filterCookies(cookieArray,splitPath[1]);
        }
        

        cookieName = undefined;
        prefix = undefined;

        if(cookieCheckInfo.length==1)
        {
            cookieName = cookieCheckInfo[0].sessionCookieHeaderName
            prefix = cookieCheckInfo[0].prefix
        }
        
        //so if everything exists, I'm just going to pass you through
        if(cookieExists(req.cookies,"vp") && cookieExists(req.cookies,cookieCheckInfo[0].sessionCookieHeaderName))
        {
            //pass through the request
            next();
        }
        else
        {
            console.log('prefix');
            if(prefix==undefined)
            {
                res.send("<h2>The prefix provided does not match an existing Qlik Sense virtual proxy prefix</h2>");
            }
            else
            {
                res.redirect(req.protocol + "://" + req.hostname + 
                (prefix.length==0 ? "": "/" + prefix) + "/content/default/qmcutils.html");  
            }

            next();
        }

    });

    router.route('/')
    .get(function(req, res)
    {
        var options = {
            root: config.thisServer.appPath
        };
        res.sendFile('main.html', options, function(err)
        {
            if(err)
            {
                logger.error("ERROR:" + err, {module:'routes.js'});
                res.status(err.status).end();
            }
        });
    });
});

module.exports = router;


function filterCookies(cookieArray, prefix)
{
    return cookieArray.filter(function(item)
    {
        return item.prefix === prefix;
    });
}

function cookieExists(cookies, cookieName)
{
    if(cookieName !==undefined)
    {
        for(var key in cookies)
        {
            if(key === cookieName)
            {
                return true;
            }
        }
    }
    return false;
}