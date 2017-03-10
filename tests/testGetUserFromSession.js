var request = require('request');
var config = require("../config/config");
var fs = require('fs');


var r = request.defaults({
    rejectUnauthorized: false,
    host: config.qrs.hostname,
    isSecure: true,
    cert: fs.readFileSync(config.certificates.client),
    key: fs.readFileSync(config.certificates.client_key),
    headers: {
        'x-qlik-xrfkey': 'abcdefghijklmnop',
        'content-type': 'application/json'
    }
});

var checkUser = function(vp, sessionId) {
    r.get({
            uri: "https://" + config.qrs.hostname + ":4243/qps/" + vp + "/" + sessionId + "?xrfkey=abcdefghijklmnop"
        },
        function(err, res, body) {
            return body;
        });
}

module.exports = checkUser;