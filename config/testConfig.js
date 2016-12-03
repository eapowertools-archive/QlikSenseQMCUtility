
var path = require('path');

var certPath = 'f:/my documents/_git/qliksenseqmcutility/certs';

var config = {
    certificates : {
        certPath: 'f:/my documents/_git/qliksenseqmcutility/certs',
        client: path.resolve(certPath, 'client.pem'),
		client_key: path.resolve(certPath,'client_key.pem'),
		server: path.resolve(certPath, 'server.pem'),
		server_key: path.resolve(certPath, 'server_key.pem'),
		root: path.resolve(certPath,'root.pem')
    },
    thisServer : {
        hostname: 'sense3.112adams.local'
    },
    qrs : {
        hostname: 'sense3.112adams.local'
    }
};


module.exports = config;