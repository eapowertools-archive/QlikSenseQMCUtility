var qrsInteract = require('qrs-interact');
var config = require('../config/config')
var Promise = require('bluebird');

var qrsConfig = {
    hostname: config.qrs.hostname,
    localCertPath: config.certificates.certPath
};

var qrs = new qrsInteract(qrsConfig);

var cookieNames = {
    cookieNames : function()
    {
        return new Promise(function(resolve, reject)
        {
            var path = "virtualproxyconfig/full"
            return qrs.Get(path)
            .then(function(result)
            {
                //console.log(result.body);
                return Promise.map(result.body, function(item)
                {
                    return {
                        prefix : item.prefix,
                        sessionCookieHeaderName : item.sessionCookieHeaderName
                    }
                });
            })
            .then(function(vps)
            {
                resolve(vps);
            })
            .catch(function(error)
            {
                reject(error);
            });
        });
    }
};

module.exports = cookieNames;