(function() {
  'use strict';

  angular
    .module('zaya-content')
    .config(mainRoute);

  function mainRoute($stateProvider, $urlRouterProvider, CONSTANT) {

    $stateProvider
      .state('content', {
          url : '/content',
          abstract : true,
          template : '<ion-nav-view name="state-content"></ion-nav-view>'
      })
      .state('content.video', {
          url : '/video',
          nativeTransitions: null,
          params: {
            video: null,
          },
          onEnter: ['orientation','audio', function(orientation, audio) {
            orientation.setLandscape();
            audio['demo-2'].stop();
          }],
          views : {
              'state-content' : {
                  templateUrl : CONSTANT.PATH.CONTENT + '/content.video' + CONSTANT.VIEW,
                  controller : 'contentController as contentCtrl'
              }
          }
      })
      .state('content.vocabulary',{
          url : '/vocabulary',
          abstract : true,
          params : {
              vocab_data : null
          },
          views : {
              'state-content' : {
                  template : '<ion-nav-view name="state-vocab"></ion-nav-view>'
              }
          }
      })
      .state('content.vocabulary.intro', {
          url : '/intro',
          nativeTransitions : null,
          onEnter : ['orientation',function(orientation){
              orientation.setLandscape();
          }],
          views : {
              'state-vocab' : {
                  templateUrl : CONSTANT.PATH.CONTENT + '/content.vocabulary.intro' + CONSTANT.VIEW,
                  controller : ['$stateParams','audio','$timeout','$state', '$scope', 'User', '$rootScope','$log',function($stateParams,audio,$timeout,$state, $scope, User,$rootScope, $log){
                      var vocabIntroCtrl = this;
                      vocabIntroCtrl.vocab_data = $stateParams.vocab_data;
                      $scope.vocab_data = $stateParams.vocab_data;
                      vocabIntroCtrl.playDelayed = playDelayed;
                      $scope.userGender = User.getActiveProfileSync().data.profile.gender;
                      $log.debug("Rootscope",$rootScope);
                      function playDelayed (url) {
                          $timeout(function(){
                              audio.player.play(url, function(){
                                  $state.go('content.vocabulary.overview',{})
                              });
                          },100);
                      }
                      $scope.$on('appResume',function(){
                        audio.player.resume();
                        audio.player.addCallback(function(){
                                  $state.go('content.vocabulary.overview',{})
                              });
                      });
                      vocabIntroCtrl.playDelayed(vocabIntroCtrl.vocab_data.node.parsed_sound);
                  }],
                  controllerAs : 'vocabIntroCtrl'
              }
          }
      })
      .state('content.vocabulary.overview', {
          url : '/overview',
          nativeTransitions : null,
          onEnter : ['orientation',function(orientation){
              orientation.setLandscape();
          }],
          views : {
              'state-vocab' : {
                  templateUrl : CONSTANT.PATH.CONTENT + '/content.vocabulary.overview' + CONSTANT.VIEW,
                  controller : 'vocabularyOverviewController as vocabOverviewCtrl'
              }
          }
      })
      .state('content.vocabulary.card', {
          url : '/card',
          nativeTransitions : null,
          onEnter : ['orientation',function(orientation){
              orientation.setLandscape();
          }],
          views : {
              'state-vocab' : {
                  templateUrl : CONSTANT.PATH.CONTENT + '/content.vocabulary' + CONSTANT.VIEW,
                  controller : 'vocabularyCardController as vocabCardCtrl'
              }
          }
      })
      .state('content.vocabulary.instruction', {
          url : '/instruction',
          nativeTransitions : null,
          views : {
              'state-vocab' : {
                  templateUrl : CONSTANT.PATH.CONTENT + '/content.vocabulary.instruction' + CONSTANT.VIEW,
                  controller : ['$stateParams','audio','$timeout','$state', '$scope', 'User','$log',function($stateParams,audio,$timeout,$state, $scope, User, $log){
                      var vocabInstructionCtrl = this;
                      $log.debug("vocab instruction stateparams",$stateParams);
                      vocabInstructionCtrl.vocab_data = $stateParams.vocab_data.objects;
                      vocabInstructionCtrl.params = $stateParams;
                      vocabInstructionCtrl.playDelayed = playDelayed;
                      $scope.userGender = User.getActiveProfileSync().data.profile.gender;
                      function playDelayed (url) {
                          $timeout(function(){
                              audio.player.play(url, function(){
                                  $state.go('content.vocabulary.card',{})
                              })
                          },100)
                      }
                      vocabInstructionCtrl.playDelayed('sound/now_its_your_turn.mp3')
                  }],
                  controllerAs : 'vocabInstructionCtrl'
              }
          }
      })
  }
})();
