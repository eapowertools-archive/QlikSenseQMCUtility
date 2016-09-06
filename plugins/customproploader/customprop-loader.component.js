(function(){
    "use strict";
    var module = angular.module("QMCUtilities");

    function customPropController($http)
    {
        var model= this;
        model.$onInit = function()
        {
            model.hw = 'Hello World';
        };
    }

    module.component("custompropLoaderBody",
    {
        templateUrl: "plugins/customproploader/customprop-loader-body.html",
        controllerAs: "model",
        controller: ["$http", customPropController]
    });

}());