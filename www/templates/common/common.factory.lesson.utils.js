(function() {
  'use strict';

  angular
    .module('common')
    .factory('lessonutils', lessonutils);

  lessonutils.$inject = ['$ionicLoading', '$state', '$stateParams', 'Rest', '$log', 'CONSTANT', '$timeout', '$sce', '$ionicPopup','data', 'mediaManager'];

  /* @ngInject */
  function lessonutils($ionicLoading, $state, $stateParams, Rest, $log, CONSTANT, $timeout, $sce, $ionicPopup, data, mediaManager) {
    var utils = {
      leaveLesson: leaveLesson,
      getLesson: getLesson,
      getLocalLesson: getLocalLesson,
      setLocalLesson: setLocalLesson,
      resourceType: resourceType,
      getIcon: getIcon,
      playResource: playResource,
      getSrc: getSrc,
      currentState: currentState,
      getGender : getGender,
      downloadLesson : downloadLesson
    };

    return utils;

    function getGender(){
        return localStorage.profile ? JSON.parse(localStorage.profile).gender : false;
    }
    function leaveLesson() {
      !$state.is('map.navigate') &&
        $ionicLoading.show({
          noBackdrop: false,
          hideOnStateChange: true
        });
      $timeout(function() {
        $state.go('map.navigate');
    },1000)
    }

    function currentState(resource) {
      if ($stateParams.type == 'assessment' && utils.resourceType(resource) == 'assessment' && $state.current.name!='quiz.summary') {
        return true;
      } else if ($stateParams.type == 'practice' && utils.resourceType(resource) == 'practice' && $state.current.name!='quiz.summary') {
        return true;
      } else if ($state.is('content.video') && utils.resourceType(resource) == 'video') {
        return true;
      } else {
        return false;
      }
    }

    function getLesson(id, scope, callback) {
      $ionicLoading.show({
        noBackdrop: false,
      });
      data.getLesson(id).then(function(response) {
        $ionicLoading.hide();
        utils.setLocalLesson(JSON.stringify(response));
        $log.debug(response)
        callback && callback(response);
      }, function(error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Sorry',
          template: 'You need to be online!'
        });
      })
    }

    function getLocalLesson() {
      return localStorage.lesson? JSON.parse(localStorage.lesson) : {};
    }

    function setLocalLesson(lesson) {
      localStorage.setItem('lesson', lesson);
    }

    function resourceType(resource) {
      if (resource.node.content_type_name == 'assessment' && resource.node.type.type == 'assessment') {
        return 'assessment';
      } else if (resource.node.content_type_name == 'assessment' && resource.node.type.type == 'practice') {
        return 'practice';
      } else if (resource.node.content_type_name == 'resource' && resource.node.type.file_type == 'mp4') {
        return 'video';
      } else {}
    }

    function getIcon(resource) {
      if (resource.node.content_type_name == 'assessment' && resource.node.type.type == 'assessment') {
        return CONSTANT.ASSETS.IMG.ICON + '/quiz.png';
      } else if (resource.node.content_type_name == 'assessment' && resource.node.type.type == 'practice') {
        return CONSTANT.ASSETS.IMG.ICON + '/practice.png';
      } else if (resource.node.content_type_name == 'resource' && resource.node.type.file_type == 'mp4') {
        return CONSTANT.ASSETS.IMG.ICON + '/video.png';
      } else {

      }
    }

    function playResource(resource, video) {
      $ionicLoading.show({
        // noBackdrop: false,
        hideOnStateChange: true
      });
      $log.debug(resource);
      if (utils.resourceType(resource) == 'assessment') {
        $timeout(function() {
          $stateParams.type != 'assessment' &&
            $state.go('quiz.start', {
              id: resource.node.id,
              type: 'assessment',
              quiz: resource
            });
          $stateParams.type == 'assessment' && $ionicLoading.hide();
      });
      } else if (utils.resourceType(resource) == 'practice') {
        $timeout(function() {
          $stateParams.type != 'practice' &&
            $state.go('quiz.start', {
              id: resource.node.id,
              type: 'practice',
              quiz: resource
            });
          $stateParams.type == 'practice' && $ionicLoading.hide();
      });
      } else if (utils.resourceType(resource) == 'video') {
        $timeout(function() {
          !$state.is('content.video') &&
            $state.go('content.video', {
              video: {
                src: utils.getSrc(resource, resource.node.type.path),
                type: 'video/mp4'
              }
            });
          if ($state.is('content.video')) {
            video.play();
            $ionicLoading.hide();
          }
      });
        //   utils.config.sources[0].src = utils.getSrc(resource.node.type.path);
      } else {}
    }

    function downloadLesson(id) {
      $ionicLoading.show();
      data.downloadLesson(id).then(function(response){
      }).catch(function(error){
        $log.debug("error",error)
      }).finally(function(){
        $ionicLoading.hide()
      })
    }

    function getSrc(resource, src) {
        var src = !JSON.parse(localStorage.lesson).media[0].downloaded ? CONSTANT.BACKEND_SERVICE_DOMAIN + src : mediaManager.getPath(src);
        $log.debug('get source of resource',JSON.parse(localStorage.lesson).media[0].downloaded, src);
      return $sce.trustAsResourceUrl(src);
    }
  }
})();
