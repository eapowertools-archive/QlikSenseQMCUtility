angular.module("QMCUtilities")
    .factory('menuItems', ['$http', function($http) {
        return $http.get("api/menu")
            .then(function(response) {
                return response.data;
            });
    }])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        //$urlRouterProvider.deferIntercept();
        $locationProvider.html5Mode(true);
        $stateProviderRef = $stateProvider;
        $urlRouterProviderRef = $urlRouterProvider;
    })
    .run(['$q', '$rootScope', '$http', '$state', '$urlRouter', 'qlikConfig', 'menuItems', 'qmcuWindowLocationService', function($q, $rootScope, $http, $state, $urlRouter, qlikConfig, menuItems,qmcuWindowLocationService) {
        console.log(qmcuWindowLocationService)
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toStateParams, fromState, fromParams, options) {
                console.log(toState);
                $rootScope.toState = toState;
                $rootScope.toStateUrl = toState.url;

                $rootScope.toStateParams = toStateParams;
            });

        $stateProviderRef.state('site', {
            'abstract': true,
            initialize: {
                // authorize: ['authorization',
                //     function(authorization) {
                //         console.log('doing authorization');
                //         return authorization.authorize();
                //     }
                // ],
                // identity: ['principal',
                //     function(principal) {
                //         return principal.identity();
                //     }
                // ],
                // config: ['qlikConfig',
                //     function(qlikConfig) {
                //         return qlikConfig.getConfig();
                //     }
                // ]
            }
        });

        // $stateProviderRef.state('accessdenied', {
        //     parent: 'site',
        //     templateUrl: "plugins/global/views/accessdenied.html",
        //     data: {
        //         roles: []
        //     }
        // });

        // $stateProviderRef.state('welcome', {
        //     url: "/",
        //     templateUrl: "plugins/global/views/welcomeScreen.html",
        //     data: {
        //         roles: []
        //     },
        //     resolve: {
        //         authorize: ['authorization',
        //             function(authorization) {
        //                 console.log('doing authorization');
        //                 return authorization.authorize();
        //             }
        //         ]
        //     },
        //     controller: function(principal, authorization) {
        //         var self = this;

        //         self.doLogin = function() {
        //             authorization.login();
        //         };

        //         self.isAuthenticated = principal.isAuthenticated;
        //     },
        //     controllerAs: 'model'

        // });


        menuItems.then(function(menuItem) {
            angular.forEach(menuItem, function(e) {

                $stateProviderRef.state(e.stateName, {
                    parent: 'site',
                    url: e.url,
                    templateUrl: e.templateUrl,
                    data: e,
                    resolve: {
                        // allowed: ['authorization', '$q', '$state', '$stateParams',
                        //     function(authorization, $q, $state, $stateParams) {
                        //         var deferred = $q.defer();
                        //         principal.identity().then(function() {
                        //             if (authorization.stateIsAuthorized(e, 'resolve')) {
                        //                 deferred.resolve();
                        //             } else {
                        //                 console.log('rejected');
                        //                 if (principal.isAuthenticated()) $state.go('accessdenied');
                        //                 if (!principal.isAuthenticated()) $state.go('welcome');

                        //                 deferred.reject();
                        //             }
                        //         })
                        //         return deferred.promise;
                        //     }
                        // ],
                        // identity: ['principal',
                        //     function(principal) {
                        //         return principal.identity();
                        //     }
                        // ],
                        loadMyCtrl: ['$stateParams', '$ocLazyLoad', function($stateParams, $ocLazyLoad) {
                            if (e.clientFiles.length > 0) {
                                return $ocLazyLoad.load(e.clientFiles);
                            } else {
                                return $ocLazyLoad.load([
                                    "plugins/" + e.stateName + "/" + e.stateName + ".component.js",
                                    "plugins/" + e.stateName + "/css/" + e.stateName + ".css"
                                ]);
                            }
                        }]
                    }
                });

            });

            //$urlRouterProviderRef.otherwise('/');
            $urlRouter.sync();
            $urlRouter.listen();
        });

    }])