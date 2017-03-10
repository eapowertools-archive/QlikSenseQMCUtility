(function() {
    "use strict";

    var module = angular.module("QMCUtilities");


    function controller($state, qlikConfig) {
        var model = this;
        model.$state = $state;
        model.menuItems = [];

        model.$onInit = function() {
            model.menuItems = qlikConfig.menuItems;
        };

        model.goToState = function(state, menuItem) {
            console.log(state);
        $state.go(state);
    }
    }

    

    module.component("menuList", {
        templateUrl: "app/menu-list.component.html",
        controllerAs: "model",
        controller: ["$state", 'qlikConfig', controller]
    });

}());