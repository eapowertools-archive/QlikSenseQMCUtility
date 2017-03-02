(function() {
    "use strict";

    var $stateProviderRef = null,
        $urlRouterProviderRef = null;

    var module = angular.module("QMCUtilities", ["ui.router", "oc.lazyLoad", "ngSanitize", "localytics.directives"]);

    module.service('qmcuWindowLocationService', ['$location', function qmcuWindowLocationService($location) {
        var windowLocation = $location.absUrl().toLowerCase(),
            indexEndBaseUrl = windowLocation.indexOf('/qmcu/'),
            resourceBaseUrl = indexEndBaseUrl > 0 ? windowLocation.substr(0, indexEndBaseUrl) : windowLocation,
            proxyPath,
            pos;

        console.log("Hello World");
        console.log("windowLocation: " + windowLocation);

        if (resourceBaseUrl.slice(-1) === '/') {
            resourceBaseUrl = resourceBaseUrl.slice(0, resourceBaseUrl.length - 1);
        }

        pos = resourceBaseUrl.indexOf('/', 9);
        proxyPath = pos > -1 ? resourceBaseUrl.substr(pos) : '';

        return {
            basePath: "/qmcu",
            baseUrl: resourceBaseUrl,
            virtualProxyPath: proxyPath
        };


    }]);

    module
        .factory('qlikConfig', ['$q', '$http', 'menuItems', function($q, $http, menuItems) {
            var context = {};
            menuItems.then(function(menu) {
                context.menuItems = menu;
            });

            return context;
        }])

    module.config(["$ocLazyLoadProvider", function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true

        })
    }]);


}());

//Interceptor code
var interceptor = function(qmcuWindowLocationService) {
    return {
        // request: function(config) {
        //     console.log(config);
        //     return config;
        // }

        'request': function(config) {
            console.log(config);
            console.log("url: " + config.url);
            console.log("baseUrl: " + qmcuWindowLocationService.baseUrl)
            console.log("proxyPath: " + qmcuWindowLocationService.virtualProxyPath);

            //Prefix with virtual proxy path if not an absolute address
            if (!(/:\/\//).test(config.url)) {
                config.url = qmcuWindowLocationService.virtualProxyPath + qmcuWindowLocationService.basePath + "/" + config.url;
                console.log(config.url);
            }
            // console.log("config");
            // console.log(config);
            return config;
        }

    }
};