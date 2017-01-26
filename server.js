var express = require('express');
var app = new express();
var https = require('https');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var config = require('./config/config');
var winston = require('winston');
require('winston-daily-rotate-file');
var routeBuilder = require('./routeBuilder');
var socketio = require('socket.io');

//set up logging
var logger = new(winston.Logger)({
  level: config.logging.logLevel,
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.DailyRotateFile)({
      filename: config.logging.logFile,
      prepend: true
    })
  ]
});

logger.info('Firing up QMC Utilities', {
  module: 'server'
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/public', express.static(config.thisServer.publicPath));
app.use('/bower_components', express.static(config.thisServer.bowerPath));
app.use('/node_modules', express.static(config.thisServer.nodeModulesPath));
app.use('/data', express.static(config.thisServer.dataPath));
app.use('/app', express.static(config.thisServer.appPath));
app.use('/plugins', express.static(config.thisServer.pluginPath));

logger.info(config.thisServer.appPath);

var routes = require('./routes/routes');

app.use('/', routes);


var menu = [];
routeBuilder.forEach(function (route, index) {

  app.use('/' + route.name, require(route.path));
  //build menu
  var item = {
    "id": index + 1,
    "title": route.title,
    "templateUrl": "/" + route.name,
    "stage": route.stage
  };
  menu.push(item);
});

fs.writeFileSync(config.thisServer.dataPath + '/menu.json', JSON.stringify(menu));

var httpsOptions = {}

if (config.thisServer.hasOwnProperty("certificates")) {
  if (config.thisServer.certificates.server !== undefined) {
    //pem files in use
    httpsOptions.cert = fs.readFileSync(config.thisServer.certificates.server);
    httpsOptions.key = fs.readFileSync(config.thisServer.certificates.server_key);
  }

  if (config.thisServer.certificates.pfx !== undefined) {
    httpsOptions.pfx = fs.readFileSync(config.thisServer.certificates.pfx);
    httpsOptions.passphrase = config.thisServer.certificates.passphrase;
  }
} else {
  httpsOptions.cert = fs.readFileSync(config.certificates.server),
    httpsOptions.key = fs.readFileSync(config.certificates.server_key)
}

var server = https.createServer(httpsOptions, app);
server.listen(config.thisServer.port, function () {
  logger.info('QMCUtilities started', {
    module: 'server'
  });
});

var io = new socketio(server);

io.on('connection', function (socket) {
  routeBuilder.forEach(function (route, index) {
    if (route.useSocketIO) {
      socket.on(route.name, function (msg) {
        console.log(route.name + "::" + msg);
        socket.emit(route.name, msg);
      });
    }
  });
});