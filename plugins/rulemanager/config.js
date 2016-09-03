var extend = require('extend');
var mainConfig = require('../../config/config');


var config = {
    qrs: {
        hostname : mainConfig.qrs.hostname,
        localCertPath : mainConfig.certificates.certPath
    }
};

config = extend(true, mainConfig, config);



module.exports = config;