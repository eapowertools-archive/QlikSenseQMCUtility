(function() {
    "use strict";
    var app = angular.module('QMCUtilities', []);

    app.config(function($provide) {
        $provide.provider("qmcuWindowLocationService", function($location) {
            this.$get = function() {
                var windowLocation = $location.absUrl().toLowerCase(),
                    indexEndBaseUrl = windowLocation.indexOf('/qmc/'),
                    resourceBaseUrl = indexEndBaseUrl > 0 ? windowLocation.substr(0, indexEndBaseUrl) : windowLocation,
                    proxyPath,
                    pos;

                if (resourceBaseUrl.slice(-1) === '/') {
                    resourceBaseUrl = resourceBaseUrl.slice(0, resourceBaseUrl.length - 1);
                }

                pos = resourceBaseUrl.indexOf('/', 9);
                proxyPath = pos > -1 ? resourceBaseUrl.substr(pos) : '';

                return {
                    baseUrl: {
                        enumerable: true,
                        value: resourceBaseUrl
                    },
                    virtualProxyPath: {
                        enumerable: true,
                        value: proxyPath
                    }
                };
            }
        })
    })
}());
// app.config(["qmcuWindowLocationService", ["$location", function qmcuWindowLocationService($location) {
//     var windowLocation = $location.absUrl().toLowerCase(),
//         indexEndBaseUrl = windowLocation.indexOf('/qmc/'),
//         resourceBaseUrl = indexEndBaseUrl > 0 ? windowLocation.substr(0, indexEndBaseUrl) : windowLocation,
//         proxyPath,
//         pos;

//     if (resourceBaseUrl.slice(-1) === '/') {
//         resourceBaseUrl = resourceBaseUrl.slice(0, resourceBaseUrl.length - 1);
//     }

//     pos = resourceBaseUrl.indexOf('/', 9);
//     proxyPath = pos > -1 ? resourceBaseUrl.substr(pos) : '';

//     Object.defineProperties(this, {
//         baseUrl: {
//             enumerable: true,
//             value: resourceBaseUrl
//         },
//         virtualProxyPath: {
//             enumerable: true,
//             value: proxyPath
//         }
//     });
// }]])