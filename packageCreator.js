var fs = require('fs');
var config = require('./config/config');
var _ = require("lodash");
var exec = require("child_process");

var path = config.thisServer.pluginPath;

var results = fs.readdirSync(path);
var packages = [];
results.forEach(function(result) {
    var stats = fs.statSync(path + '/' + result);
    if (stats.isDirectory()) {

        var dirContents = fs.readdirSync(path + '/' + result);
        dirContents.forEach(function(file) {
            var stats = fs.statSync(path + '/' + result + '/' + file);
            if (stats.isFile() && file === "package.json") {
                var content = JSON.parse(fs.readFileSync(path + '/' + result + '/' + file));


                var depends = content.dependencies;
                //console.log(depends);
                for (var i in depends) {
                    // console.log(i + ": " + depends[i]);
                    packages.push(i);
                }
            }
        });

    }
});

//console.log(_.uniq(packages));
//add the master package.json
var mainPackageFile = JSON.parse(fs.readFileSync("./package.json"));
for (var i in mainPackageFile.dependencies) {
    packages.push(i);
}

_.uniq(packages).forEach(function(package) {
    console.log(package + ": " + exec.execSync("npm view " + package + " version"));
    console.log("Running npm install on package: " + package);
    exec.execSync("npm install " + package + " --save");
})