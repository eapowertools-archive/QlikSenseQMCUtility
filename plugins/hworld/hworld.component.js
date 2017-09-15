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
        model.example1About = "";
        model.tagName = "";

        model.$onInit = function () {
            getVersion($http)
                .then(function (result) {
                    model.version = result;
                });
        };

        model.getAboutInfo = function () {
            return $http.get('./hworld/getAboutInfo')
                .then(function (response) {
                    model.example1About = JSON.stringify(response.data);
                });
        };

        model.addNewTag = function () {
            return $http.post('./hworld/addNewTag', {
                    "name": model.tagName
                })
                .then(function (response) {
                    return response;
                });
        };

    }

    module.component("helloWorld", {
        transclude: true,
        templateUrl: "plugins/hworld/helloWorld.html",
        controllerAs: "model",
        controller: ["$http", hWorldController]
    });


}());