var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var winston = require('winston');
var config = require('../config/config');
var fs = require('fs');
var qrsInteract = require('qrs-interact');


var qrsConfig = {
    hostname: 'sense3.112adams.local',
    localCertPath: "F:/My Documents/_Git/QlikSenseQMCUtility/certs"
}

var qrs = new qrsInteract(qrsConfig);


//set up logging
var logger = new (winston.Logger)({
	level: config.logging.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: config.logging.logFile})
    ]
});

router.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

router.route('/')
    .get(function(request, response)
    {
        var options = {
            root: config.thisServer.appPath
        };
        response.sendFile('main.html', options, function(err)
        {
            if(err)
            {
                logger.error("ERROR:" + err, {module:'routes.js'});
                response.status(err.status).end();
            }
        })
    });

router.route('/getSheets')
    .get(function(request,response)
    {
        //first get the table file;
        var tableDef = fs.readFileSync(config.thisServer.dataPath + "tableDef.json");

        var filter = "((objectType+eq+%27sheet%27))";

        qrs.Post("app/object/table?filter=" + filter + "&orderAscending=true&skip=0&sortColumn=name", JSON.parse(tableDef),"json")
        .then(function(result)
        {
            var s = JSON.stringify(result);
            response.send(s);
        })
        .catch(function(error)
        {
            response.send(error);
        });

    });

router.route('/approveSheets')
    .post(parseUrlencoded, function(request,response)
    {
        var res = response;
        console.log(request.body);
        var selectionBody = createSelection(request.body);
        var selectionId = "";
        var message = {};
        qrs.Post('selection', selectionBody,"json")
        .then(function(result)
        {
            console.log('selectionid: ' + result.id);
            selectionId = result.id;

            var putBody = buildBody(true);

            return qrs.Put('selection/' + selectionId + '/App/Object/synthetic',putBody,'json')
            .then(function(result)
            {
                console.log('Put Response: ' + result);
                if(result===204)
                {
                    message.success = true;
                    return qrs.Get('selection/' + selectionId + '/app/object/full')
                    .then(function(result)
                    {
                        message.items = result;
                        return qrs.Delete('selection/' + selectionId)
                        .then(function()
                        {
                            console.log('selection deleted');
                            return message;
                        });
                    });
                }
            })
            .catch(function(error)
            {
                message.success = false;
                console.log(error);
                res.json(message);
            });
        })
        .then(function(result)
        {
            response.json(message);
        })
        .catch(function(error)
        {
            message.success = false;
            console.log(error);
            res.json(message);
        });
    });

router.route('/unapproveSheets')
    .post(parseUrlencoded, function(request,response)
    {
        var res = response;
        console.log(request.body);
        var selectionBody = createSelection(request.body);
        var selectionId = "";
        var result = {};
        qrs.Post('selection', selectionBody,"json")
        .then(function(response)
        {
            console.log('selectionid: ' + response.id);
            selectionId = response.id;
            var putBody = buildBody(false);

            qrs.Put('selection/' + selectionId + '/App/Object/synthetic',putBody,'json')
            .then(function(response)
            {
                console.log('Put Response: ' + response);
                if(response===204)
                {
                    result.success = true;
                    qrs.Get('selection/' + selectionId + '/app/object/full')
                    .then(function(response)
                    {
                        result.items = response;
                        qrs.Delete('selection/' + selectionId)
                        .then(function()
                        {
                            console.log('selection deleted');
                            res.json(result);
                        });
                    });
                }
            })
            .catch(function(error)
            {
                result.success = false;
                console.log(error);
                res.json(result);
            });
        })
        .catch(function(error)
        {
            result.success = false;
            console.log(error);
            res.json(result);
        });
    });

module.exports = router;

function makeTime()
{
    var d = new Date();
    return d.toISOString();
}

function createSelection(sheetIds)
{
    var array = []
    sheetIds.forEach(function(sheetId)
    {
        var item = {
            type: "App.Object",
            objectID: sheetId
        };
        array.push(item)
    });

    var result = {items: array};

    return result;
}

function buildBody(value)
{
    return {
                "latestModifiedDate": makeTime(),
                "type": "App.Object",
                "properties": [
                    {
                        "name": "approved",
                        "value": value,
                        "valueIsDifferent": false,
                        "valueIsModified":true
                    }
                ]
            };
}