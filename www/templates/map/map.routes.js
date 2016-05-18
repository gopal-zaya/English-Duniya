(function() {
  'use strict';

  angular
    .module('zaya-map')
    .config(mainRoute);

  function mainRoute($stateProvider, $urlRouterProvider, CONSTANT) {

    $stateProvider
      .state('map', {
        url: '/map',
        abstract: true,
        resolve: {
          lessons: ['Rest', '$log', '$http', function(Rest, $log, $http) {
            return Rest.one('accounts', CONSTANT.CLIENTID.ELL).customGET('lessons', {
              limit: 25
            }).then(function(lessons) {
              return lessons.plain().results;
            }, function(error) {
              $log.debug('some error occured', error);
            })
          }],
          scores: ['Rest', '$log', function(Rest, $log) {
            return Rest.one('accounts', CONSTANT.CLIENTID.ELL).one('profiles', JSON.parse(localStorage.user_details).profile).customGET('lessons-score', {
              limit: 25
            }).then(function(score) {
              $log.debug('scores rest', score.plain());
              return score.plain().results;
            }, function(error) {
              $log.debug('some error occured', error);
            })
          }]

        },
        template: '<ion-nav-view name="state-map"></ion-nav-view>'
      })
      .state('map.navigate', {
        url: '/navigate',
        onEnter: ['$state', 'lessons', function($state, lessons) {
          if (!lessons) {
            $state.go('map.unauthorised');
          }
        }],
        views: {
          'state-map': {
            templateUrl: CONSTANT.PATH.MAP + '/map' + CONSTANT.VIEW,
            controller: 'mapController as mapCtrl'
          }
        }
      })
      .state('map.unauthorised', {
        url: '/unauthorised',
        views: {
          'state-map': {
            templateUrl: CONSTANT.PATH.MAP + '/map.unauthorised' + CONSTANT.VIEW,
            controller: 'mapController as mapCtrl'
          }
        }
      })
  }
})();
