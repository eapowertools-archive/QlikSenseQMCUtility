(function() {
    "use strict";

    var module = angular.module("QMCUtilities");

    function getUser($http) {
        return $http.get("./whoareyou")
            .then(function(result) {
                return result.data
            });
    }

    function controller($state, $http, qlikConfig) {
        var model = this;
        model.$state = $state;
        model.menuItems = [];

        model.$onInit = function() {
            model.menuItems = qlikConfig.menuItems;
            getUser($http)
                .then(function(result) {
                    model.user = result;
                });
        };

        model.goToState = function(state, menuItem) {
            console.log(state);
            $state.go(state);
        }
    }



    module.component("menuList", {
        templateUrl: "app/menu-list.component.html",
        controllerAs: "model",
        controller: ["$state", "$http", 'qlikConfig', controller]
    });

}());