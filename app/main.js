(function() {
  "use strict";
   var module = angular.module("QMCUtilities",["ngRoute"]);
  
  module.config(function($routeProvider){
    $routeProvider
      .when("/:name*", {templateUrl: function(urlAttr) {
       
        return "app/" + urlAttr.name + "/index.html";
        
      }})
      .otherwise({ redirectTo:"/home"});
  });

}());