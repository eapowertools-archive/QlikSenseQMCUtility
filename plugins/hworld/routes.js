var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
    extended: false
});
var qrsInteract = require('qrs-interact');

var config = require('./config');

// Set up connection to QRS, logic is for dev or non-dev mode
var qrsConfig = {
    hostname: config.qrs.hostname,
    localCertPath: config.qrs.localCertPath
};
if (!config.thisServer.devMode) {
    qrsConfig['headers'] = {
        "Cookie": "",
        "Content-Type": "application/json"
    };
}
var qrsInstance = new qrsInteract(qrsConfig);
if (!config.thisServer.devMode) {
    router.use(function (req, res, next) {
        if (req.proxyPath.length !== 0) {
            qrsInstance.UpdateVirtualProxyPrefix(req.proxyPath.replace("/", ""));
        }
        qrsInstance.UseCookie(req.sessionCookieToUse);

        next();
    })
}

router.route('/getAboutInfo')
    .get(function (request, response) {
        return qrsInstance.Get('about')
            .then(function (result) {
                response.send(result.body);
                return;
            })
            .catch(function (error) {});
    });

router.route('/addNewTag')
    .post(parseUrlencoded, function (request, response) {
        return qrsInstance.Post(
            'tag', {
                name: request.body.name
            },
            'json'
        );
    });

module.exports = router;