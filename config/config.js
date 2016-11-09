var path = require('path');
var fs = require('fs');
var extend = require('extend');
var installConfig;

var configPath = path.join(__dirname,'/../config/');
var dir = fs.readdirSync(configPath);
dir.forEach(function(file)
{
    if(file==='installConfig.js')
    {
        installConfig = require('./installConfig');
    }
})



var certPath = "";

var logPath = path.join(__dirname,'/../log/');
var logFile = logPath + 'QMCUtilities.log';

var globalHostname = "localhost";
var friendlyHostname;
var qrsHostname;
var certPathBackup;

if(certPathBackup !== undefined)
{
	certPath = certPathBackup;
}
else
{
	certPath = path.join(process.env.programdata, '/Qlik/Sense/Repository/Exported Certificates/.Local Certificates');
}

var config = {
    certificates: {
		certPath: certPath,
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
        port: 9945,
        hostname: friendlyHostname !== undefined ? friendlyHostname : globalHostname,
        routePath: path.join(__dirname, '/../routes/'),
		publicPath: path.join(__dirname, '/../public/'),
        bowerPath: path.join(__dirname, '/../bower_components/'),
        dataPath: path.join(__dirname, '/../data/'),
		appPath: path.join(__dirname, '/../app/'),
		pluginPath: path.join(__dirname, '/../plugins/')
    },
	qrs: {
		hostname: qrsHostname !== undefined ? qrsHostname : globalHostname
	}
}


if(friendlyHostname !==undefined || qrsHostname !== undefined || certPathBackup !== undefined)
{
	var mergedConfig = config;
}
else if(installConfig !== undefined)
{
	var mergedConfig = extend(true, config, installConfig);
}
else
{
	var mergedConfig = config;
}

module.exports = mergedConfig;
