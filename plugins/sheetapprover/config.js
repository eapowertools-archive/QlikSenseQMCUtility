var extend = require('extend');
var mainConfig = require('../../config/config');


var config = {
    qrs: {
        hostname : "sense3.112adams.local",
        localCertPath : "F:/My Documents/_Git/QlikSenseQMCUtility/certs"
    }
};

config = extend(true, mainConfig, config);



module.exports = config;