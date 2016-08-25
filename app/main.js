(function() {
  "use strict";
   var module = angular.module("QMCUtilities",["ngRoute","angularLoad"]);
  
  module.config(function($routeProvider){
    $routeProvider
      .when("/:name*", {templateUrl: function(urlAttr) {
       
        return "plugins/" + urlAttr.name + "/index.html";
        
      }})
      .otherwise({ redirectTo:"/home"});

  });
}());