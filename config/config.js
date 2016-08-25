var path = require('path');
var extend = require('extend');
var certPath = path.join(process.env.programdata, '/Qlik/Sense/Repository/Exported Certificates/.Local Certificates');

var logPath = path.join(__dirname,'/../log/');
var logFile = logPath + 'QMCUtilities.log';

var globalHostname = 'localhost';

var config = {
    certificates: {
		client: path.resolve(certPath, 'client.pem'),
		client_key: path.resolve(certPath,'client_key.pem'),
		server: path.resolve(certPath, 'server.pem'),
		server_key: path.resolve(certPath, 'server_key.pem'),
		root: path.resolve(certPath,'root.pem')
	},
    logging: {
		logPath: logPath,
		logFile: logFile,
		logLevel: 'info'
	},
    thisServer: {
        port: 7777,
        hostname: globalHostname,
        routePath: path.join(__dirname, '/../routes/'),
		publicPath: path.join(__dirname, '/../public/'),
        bowerPath: path.join(__dirname, '/../bower_components/'),
        dataPath: path.join(__dirname, '/../data/'),
		appPath: path.join(__dirname, '/../app/'),
		pluginPath: path.join(__dirname, '/../plugins/')
    }
}

module.exports = config;