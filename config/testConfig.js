var path = require('path');

var certPath = 'F:/My Documents/CertFiles/sense32.112adams.local';

var config = {
    certificates: {
        certPath: 'F:/My Documents/CertFiles/sense32.112adams.local',
        client: path.resolve(certPath, 'client.pem'),
        client_key: path.resolve(certPath, 'client_key.pem'),
        server: path.resolve(certPath, 'server.pem'),
        server_key: path.resolve(certPath, 'server_key.pem'),
        root: path.resolve(certPath, 'root.pem')
    },
    qrs: {
        hostname: 'sense32.112adams.local'
    }
};


module.exports = config;