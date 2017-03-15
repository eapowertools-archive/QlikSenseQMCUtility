var fs = require('fs');
var config = require('./config/config');
var _ = require("lodash");

var path = config.thisServer.pluginPath;

var results = fs.readdirSync(path);
var routes = [];

results.forEach(function(result) {
    var stats = fs.statSync(path + '/' + result);
    if (stats.isDirectory()) {

        var dirContents = fs.readdirSync(path + '/' + result);
        dirContents.forEach(function(file) {
            var stats = fs.statSync(path + '/' + result + '/' + file);
            if (stats.isFile() && file === "manifest.json") {
                var content = JSON.parse(fs.readFileSync(path + '/' + result + '/' + file));

                var entries = _.concat(content);
                entries.forEach(function(e, i) {

                    var obj = {
                        id: i + 1,
                        name: e.componentName || e.pluginDir,
                        stateName: e.stateName || e.componentName || e.pluginDir,
                        path: "./plugins/" + e.pluginDir + "/routes",
                        pluginDir: e.pluginDir,
                        title: e.title,
                        stage: _.get(e, 'stage', ''),
                        authentication: _.merge({ enabled: false, roles: [] }, _.get(e, 'authentication')),
                        inMenu: _.get(e, 'inMenu', true),
                        clientFiles: e.clientFiles || [],
                        templateUrl: e.templateUrl || "plugins/" + e.pluginDir + "/index.html",
                        url: e.url || "/" + (e.componentName || e.pluginDir),
                        useSocketIO: e.useSocketIO ? true : false
                    };
                    if ((content.hasOwnProperty('disabled') && content.disabled !== true) || !(content.hasOwnProperty('disabled'))) routes.push(obj);
                })
            }
        });
    }
});

module.exports = routes;