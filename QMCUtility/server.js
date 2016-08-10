var express = require('express');
var app = new express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var QRS = require('qrs-interact');
var config = require('./config/config');
var winston = require('winston');

//set up logging
  var logger = new (winston.Logger)({
    level: config.logging.logLevel,
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: config.logging.logFile})
      ]
  });

  logger.info('Firing up QMC Utilities',{module:'server'});

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use('/qmcutils/public', express.static(config.thisServer.publicPath));
  app.use('/qmcutils/bower_components', express.static(config.thisServer.bowerPath));
  app.use('/qmcutils/data', express.static(config.thisServer.dataPath));
  app.use('/qmcutils/app', express.static(config.thisServer.appPath))

  logger.info(config.thisServer.appPath);

  var routes = require('./routes/routes');

  app.use('/qmcutils', routes);

  app.listen(config.thisServer.port);