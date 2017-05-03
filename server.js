var express = require('express');
var app = new express();
var https = require('https');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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
app.use(cookieParser());

if (!config.thisServer.devMode) {
    var rewrite = require("./middleware/rewrite");
    var auth = require('./middleware/auth');
    var vpList = require('./middleware/vpList');
    app.use(vpList());
    app.use(rewrite());
    app.use(auth());
}

app.use('/qmcu/public', express.static(config.thisServer.publicPath));
app.use('/qmcu/bower_components', express.static(config.thisServer.bowerPath));
app.use('/qmcu/node_modules', express.static(config.thisServer.nodeModulesPath));
app.use('/qmcu/data', express.static(config.thisServer.dataPath));
app.use('/qmcu/app', express.static(config.thisServer.appPath));
app.use('/qmcu/plugins', express.static(config.thisServer.pluginPath));
app.use('/*/qmcu/public', express.static(config.thisServer.publicPath));
app.use('/*/qmcu/bower_components', express.static(config.thisServer.bowerPath));
app.use('/*/qmcu/node_modules', express.static(config.thisServer.nodeModulesPath));
app.use('/*/qmcu/data', express.static(config.thisServer.dataPath));
app.use('/*/qmcu/app', express.static(config.thisServer.appPath));
app.use('/*/qmcu/plugins', express.static(config.thisServer.pluginPath));


logger.info(config.thisServer.appPath);




var menu = [];
routeBuilder.forEach(function(route, index) {


    app.use('/*/qmcu/' + route.name, require(route.path));
    app.use('/qmcu/' + route.name, require(route.path));
    //build menu

    menu.push(route);
});

app.use(function(req, res, next) {
    res.locals.menu = menu;
    next();
});

fs.writeFileSync(config.thisServer.dataPath + '/menu.json', JSON.stringify(menu));

var routes = require('./routes/routes');

app.use('/*/qmcu', routes);
app.use('/qmcu', routes);

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
server.listen(config.thisServer.port, function() {
    logger.info('QMCUtilities started', {
        module: 'server'
    });
    //console.log(app._router.stack);

});

var io = new socketio(server);

io.on('connection', function(socket) {
    routeBuilder.forEach(function(route, index) {
        if (route.useSocketIO) {
            socket.on(route.name, function(msg) {
                console.log(route.name + "::" + msg);
                io.emit(route.name, msg);
            });
        }
    });
});