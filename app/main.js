(function(){
  "use strict";
  var module = angular.module("QMCUtilities",["ui.router","oc.lazyLoad","ngSanitize","localytics.directives"]);
  module.config(function($stateProvider, $urlRouterProvider)
  {
    $stateProvider.state
    ('route', {
      url:"/:name",
      templateUrl: function($stateParams)
      {
        console.log($stateParams.name);
         return "plugins/" + $stateParams.name + "/index.html";
      },
      resolve: {
        loadMyCtrl : ['$stateParams','$ocLazyLoad',function($stateParams,$ocLazyLoad)
        {
          return $ocLazyLoad.load([
          "plugins/" + $stateParams.name + "/" + $stateParams.name + ".component.js", 
          "plugins/" + $stateParams.name + "/css/" + $stateParams.name + ".css"
          ])
          .then(function()
          {
            console.log("loaded")
          })
          .catch(function(error)
          {
            console.log(error)
          });
        }]
      }
    });

    // var helloState = {
    //   name:'hello',
    //   url:"/hworld",
    //   templateUrl: "plugins/hworld/index.html",
      
    //   resolve: {
    //     loadMyCtrl : ['$ocLazyLoad',function($ocLazyLoad)
    //     {
    //       return $ocLazyLoad.load("plugins/hworld/hello-world.component.js");
    //     }]
    //   }
    // };
    // $stateProvider.state(helloState);
    $urlRouterProvider.otherwise('/home');
  })
  .config(["$ocLazyLoadProvider", function($ocLazyLoadProvider)
  {
    $ocLazyLoadProvider.config(
      {
        debug: true

      })
  }]);


}());



/*(function() {
  "use strict";
   var module = angular.module("QMCUtilities",["ngRoute"]);
  
  module.config(['$routeProvider',function($routeProvider){
    $routeProvider
      .when("/:name*", {
        templateUrl: function(urlAttr) 
        {
          return "plugins/" + urlAttr.name + "/index.html";
        }
        // ,
        // resolve: {
        //   deps: ['$ocLazyLoad', function($ocLazyLoad)
        //     {
        //       return $ocLazyLoad.load({
        //         name:"hworld",
        //         files: ["plugins/hworld/hello-world.component.js"]
        //       })
        //       .then(function()
        //       {
        //         console.log("I Loaded")
        //       },
        //       function(err)
        //       {
        //         console.log(err);
        //       });
        //     }]
        //   } 
      })
      .otherwise({ redirectTo:"/home"});
  }])
  // .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider)
  // {
  //   $ocLazyLoadProvider.config({
  //     asyncLoader:$script
  //   });
  // }]);
}());

*/