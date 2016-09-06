var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var fs = require('fs');
var qrsInteract = require('qrs-interact');
var config = require('./config');

var qrsConfig = {
    hostname: config.qrs.hostname,
    localCertPath: config.qrs.localCertPath
}

var qrs = new qrsInteract(qrsConfig);

router.use('/data', express.static(config.thisServer.pluginPath + "/rulemanager/data"));
router.use('/output', express.static(config.thisServer.pluginPath + "/rulemanager/output"));

router.route('/getRules')
    .get(function(request,response)
    {
        //first get the table file;
        var tableDef = fs.readFileSync(config.thisServer.pluginPath + "/rulemanager/data/tableDef.json");

        var filter = "((category+eq+%27Security%27))";

        qrs.Post("systemrule/table?filter=" + filter + "&orderAscending=true&skip=0&sortColumn=name", JSON.parse(tableDef),"json")
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

router.route('/exportRules')
    .post(parseUrlencoded, function(request, response)
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
            return qrs.Get('selection/' + selectionId + '/systemrule/full')
            .then(function(result)
            {
                message.success=true;
                message.items= result;
                return qrs.Delete('selection/' + selectionId)
                .then(function()
                {
                    console.log('selection deleted');
                    //time to create the file and download it.
                    var file = config.thisServer.pluginPath + '/rulemanager/output/rules.json';
                    var destFile = fs.createWriteStream(file);
                    destFile.on('finish', function()
                    {
                        console.log('File done, downloading');
                        console.log(file);
                        response.setHeader('Content-disposition', 'attachment; filename=rules.json');
                        response.setHeader('Content-type', 'application/json');
                        return response.download('./plugins/rulemanager/output/rules.json', 'rules.json', function(error)
                        {
                            if(!error)
                            {
                                console.log('yay team');
                            }
                        });
                    });
                    
                    destFile.write(JSON.stringify(message.items));
                    destFile.end();
                });
            });
        })
        .catch(function(error)
        {
            message.success = false;
            console.log(error);
            res.json(message);
        });
    });

module.exports = router;


function createSelection(ruleIds)
{
    var array = []
    ruleIds.forEach(function(ruleId)
    {
        var item = {
            type: "SystemRule",
            objectID: ruleId
        };
        array.push(item)
    });

    var result = {items: array};

    return result;
}