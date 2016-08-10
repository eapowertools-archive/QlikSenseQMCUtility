(function() {
  "use strict";
   var module = angular.module("QMCUtilities",["ngRoute"]);
  
  module.config(function($routeProvider){
    $routeProvider
      .when("/:name*", {templateUrl: function(urlAttr) {
        console.log(urlAttr.name + ".html");
        return "app/" + urlAttr.name + "/index.html";
        
      }})
      .otherwise({ redirectTo:"/home"});
  });

}());