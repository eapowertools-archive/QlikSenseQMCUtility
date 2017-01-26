var fs = require('fs');
var config = require('./config/config');

var path = config.thisServer.pluginPath;

var results = fs.readdirSync(path);
var routes = [];

results.forEach(function(result)
{
        var stats = fs.statSync(path + '/' + result);
        if(stats.isDirectory())
        {

            var dirContents = fs.readdirSync(path + '/' + result);
            dirContents.forEach(function(file)
            {
                var stats = fs.statSync(path + '/' + result + '/' + file);
                if(stats.isFile() && file==="manifest.json")
                {
                    var content = JSON.parse(fs.readFileSync(path + '/' + result + '/' + file));
                    var obj = {
                        name: content.pluginDir,
                        path: "./plugins/" + content.pluginDir + "/routes",
                        title: content.title,
                        stage: content.stage,
                        useSocketIO: (content.useSocketIO == undefined) ? false : content.useSocketIO
                    };
                    routes.push(obj);
                }
            });
        }
});

module.exports = routes;