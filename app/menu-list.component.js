(function() {
  "use strict";
  
  var module = angular.module("QMCUtilities");
  
  function fetchMenu($http){
    return $http.get("data/menu.json")
    .then(function(response){
      return response.data;
    });
  }
  
  
  function controller($http) {
    var model = this;
    model.menuItems = [];
    
    model.$onInit = function() {
      fetchMenu($http).then(function(menuItems)
      {
        model.menuItems = menuItems;
      });
    };
  }
  
  
  module.component("menuList", {
    templateUrl:"app/menu-list.component.html",
    controllerAs: "model",
    controller: ["$http", controller]
  });
  
}());