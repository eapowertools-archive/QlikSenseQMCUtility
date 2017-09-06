(function () {
    "use strict";
    var module = angular.module("QMCUtilities");

    function getVersion($http) {
        return $http.get("./version")
            .then(function (result) {
                return result.data
            });
    }


    function hWorldController($http) {
        var model = this;
        model.response = "";

        model.$onInit = function () {
            getVersion($http)
                .then(function (result) {
                    model.version = result;
                });
        }
    }

    module.component("helloWorld", {
        transclude: true,
        templateUrl: "plugins/hworld/helloWorld.html",
        controllerAs: "model",
        controller: ["$http", hWorldController]
    });


}());