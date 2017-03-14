var config = require("../config/config");
var request = require('request');
var fs = require('fs');

var r = request.defaults({

    rejectUnauthorized: false,
    origin: config.qrs.hostname,
    host: config.qrs.hostname,
    isSecure: true,
    cert: fs.readFileSync(config.certificates.client),
    key: fs.readFileSync(config.certificates.client_key),
    headers: {
        'x-qlik-xrfkey': 'abcdefghijklmnop',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

module.exports = function(options) {
    return function(req, res, next) {
        options = options || {};


        console.log("I'm in auth.js");
        //console.log(req.virtualProxies);
        // console.log(req.cookies);

        var proxyServer = options.proxyServer || config.qrs.hostname;
        var proxyPath = req.proxyPath;
        var uri = "https://" + config.qrs.hostname + (proxyPath.length > 0 ? proxyPath : "") + "/qps/user?xrfkey=abcdefghijklmnop";
        //console.log(uri);

        var sessionName = getSessionName(req.proxyPath.replace("/", ""), req.virtualProxies)

        //console.log(sessionName);

        var cookies = digestCookie(sessionName[0].sessionCookieHeaderName, req.cookies);

        var r2;
        //console.log(cookies);
        if (cookies.length == 1) {
            r2 = r.defaults({
                headers: {
                    'Cookie': cookies[0]
                }
            })

        } else {
            r2 = r;
        }

        r2.get({
                uri: uri
            },
            function(err, response, body) {
                if (err) {
                    console.log("Error:");
                    console.log(err);
                } else {
                    // console.log(typeof body);
                    // console.log(body);
                    body = JSON.parse(body);
                    if (body.hasOwnProperty("session")) {
                        // console.log("found session property");
                        // console.log(body.session);
                        if (body.session == "inactive") {
                            console.log("redirect to login page");
                            var authUrl = "https://" + config.qrs.hostname + (proxyPath.length > 0 ? proxyPath : "") + "/content/Default/qmculogin.html"
                            var redirectUrl = encodeURI(req.redirectUrl);
                            res.redirect(authUrl + "?redirectUrl=" + redirectUrl);
                        } else {
                            next();
                        }
                    } else if (body.hasOwnProperty("logoutUri")) {
                        req.sessionCookieToUse = cookies[0];
                        //set the qrs session information for the session.
                        req.qrsInstance = setQRSInstance(req.proxyPath, cookies[0])
                        req.qsocksInstance = setQSocksInstance(req.proxyPath, cookies[0]);
                        req.userId = body.userId;
                        console.log("userId " + body.userId + " is logged in.");
                        next();
                    }
                }

            });

        //checking to see if the user is authenticated.





    }
}

function setQRSInstance(proxyPath, cookie) {
    return {
        hostname: config.qrs.hostname,
        virtualProxyPrefix: proxyPath.length > 0 ? proxyPath : '',
        localCertPath: config.qrs.localCertPath,
        headers: {
            "Cookie": cookie,
            "Content-Type": "application/json"
        }
    };
}

function setQSocksInstance(proxyPath, cookie) {
    return {
        host: config.qsocks.host,
        prefix: proxyPath.length > 0 ? proxyPath : false,
        isSecure: config.qsocks.isSecure,
        origin: config.qsocks.origin,
        rejectUnauthorized: config.qsocks.rejectUnauthorized,
        headers: {
            "Cookie": cookie,
            "Content-Type": "application/json"
        }
    }
}

function digestCookie(sessionName, cookies) {
    var digestedCookies = [];

    for (var key in cookies) {
        if (key === sessionName) {
            digestedCookies.push(key + "=" + cookies[key]);
        }
    }
    return digestedCookies;

}

function getSessionName(proxyPath, vpList) {
    return vpList.filter(function(vp) {
        return vp.prefix.toLowerCase() === proxyPath.toLowerCase();
    })
}