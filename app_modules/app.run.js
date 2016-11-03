(function() {
  'use strict';
  angular
    .module('zaya')
    .run(runConfig);

  function runConfig($ionicPlatform, $rootScope,  $log, $state, $http, $cookies, Auth,  data, audio,  analytics, network, User, queue, content, Raven, device,$cordovaPushV5,$cordovaLocalNotification, CONSTANT) {


    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $ionicPlatform.registerBackButtonAction(function(event){
      event.preventDefault();
      // event.stopPropagation();
      $log.warn("pressed hardware back button");
      $rootScope.$broadcast("backButton");
    },510)
    //$http.defaults.headers.common['Access-Control-Request-Headers'] = 'accept, auth-token, content-type, xsrfcookiename';
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {


        //if not authenticated, redirect to login page
      // if (!Auth.isAuthorised() && toState.name != 'auth.signin' && toState.name != 'auth.signup' && toState.name != 'auth.forgot') {
      //   ;
      //   event.preventDefault();
      //   $state.go('auth.signup');
      // }
    //   if (!Auth.isAuthorised() && network.isOnline() && toState.name != 'auth.autologin') {
    //     event.preventDefault();
    //     $state.go('auth.autologin');
    //   }
    //   if (!Auth.isAuthorised() && !network.isOnline() && toState.name != 'user.nointernet') {
    //     event.preventDefault();
    //     $state.go('user.nointernet');
    //   }
      // if authenticated but not verified clear localstorage and redirect to login
    //   if (Auth.isAuthorised() && !Auth.isVerified() && toState.name != 'auth.verify.phone' && toState.name != 'auth.forgot_verify_otp' && toState.name != 'auth.change_password') {
    //     ;
    //     event.preventDefault();
    //     Auth.cleanLocalStorage();
    //     $state.go('auth.signup');
    //   }
      //if authenticated and verified but has no profile, redirect to user.personalise
      // if (Auth.isAuthorised() && !Auth.hasProfile() && (toState.name != 'user.personalise')) {
      //   event.preventDefault();
      //   $state.go('user.personalise');
      // }
      //if authenticated, verified and has profile, redirect to userpage

      // if (Auth.isAuthorised() && Auth.hasProfile() && (toState.name == 'auth.signin' || toState.name == 'auth.signup' || toState.name == 'intro' || toState.name == 'auth.verify.phone' || toState.name == 'auth.forgot' || toState.name == 'auth.change_password' || toState.name == 'auth.forgot_verify_otp' || toState.name == 'user.personalise')) {
      //   event.preventDefault();
      //   $state.go('map.navigate');
      // }
      // block access to quiz summary page if there is no quiz data
//

      if(localStorage.version !== '0.1.7' && User.getActiveProfileSync() && User.getActiveProfileSync()._id){
        localStorage.setItem('version','0.1.7');

        event.preventDefault();
        User.playlist.patch(User.getActiveProfileSync()._id).then(function(){
          $state.go('litmus_start');
        })
      }

      if(toState.name !== 'user.personalise' && localStorage.getItem('profile') === null ){

        event.preventDefault();
        $state.go('user.personalise');
      }
      if(toState.name !== 'user.personalise' && localStorage.getItem('profile') !== null && JSON.parse(localStorage.getItem(('profile')))._id === undefined){
        event.preventDefault();

          var user = {
            name : JSON.parse(localStorage.getItem(('profile'))).first_name,
            grade : JSON.parse(localStorage.getItem(('profile'))).grade,
            gender :JSON.parse(localStorage.getItem(('profile'))).gender
          };

        User.profile.patch(user,JSON.parse(localStorage.getItem(('profile'))).id).then(function(response){

          $state.go('map.navigate');

          // User.profile.patch(user,JSON.parse(localStorage.getItem(('profile'))).id).then(function(response){
          //   User.setActiveProfileSync(response);
          //
          //
          //   var lessonDB = pouchDB('lessonsGrade' + User.getActiveProfileSync().data.profile.grade, {
          //     adapter: 'websql'
          //   });
          //
          //   lessonDB.destroy()
          //     .then(function(){
          //       $log.debug("Here1",CONSTANT.PATH.DATA + '/lessonsGrade' + User.getActiveProfileSync().data.profile.grade + '.db');
          //       return lessonDB.load(CONSTANT.PATH.DATA + '/lessonsGrade' + User.getActiveProfileSync().data.profile.grade + '.db')
          //     })
          //     .then(function () {
          //
          //       return lessonDB.put({
          //         _id: '_local/preloaded'
          //       });
          //     }).then(function(){
          //
          //
          //     $state.go('map.navigate');
          //
          //   })
          //     .catch(function(e){
          //
          //     })
        });
      }

      if (toState.name == 'quiz.questions' && toParams.type=='practice' && !toParams.quiz) {
        event.preventDefault();
        $state.go('map.navigate');
      }
      if (toState.name == 'quiz.start' && !toParams.quiz) {
        event.preventDefault();
        $state.go('map.navigate');
      }
      if (toState.name == 'quiz.summary' && !toParams.report) {
        event.preventDefault();
        $state.go('map.navigate');
      }
      if (toState.name == 'quiz.practice.summary' && !toParams.report) {
        event.preventDefault();
        $state.go('map.navigate');
      }
      // block content state
      if (toState.name == 'content.video' && !toParams.video) {
        event.preventDefault();
        $state.go('map.navigate');
      }

      // if (toState.name == 'auth.verify.phone') {
        // $ionicPlatform.ready(function() {
        //   if (SMS) SMS.startWatch(function() {
        //   }, function() {
        //   });
        // })

      // }

    });
    $ionicPlatform.ready(function() {
      if(localStorage.profile && localStorage.profile._id){
        Raven.setUserContext({
          device_id: device.uuid,
          user: localStorage.profile._id
        })
      }

        analytics.log(
            {
                name : 'APP',
                type : 'START',
                id : null
            },
            {
                time : new Date()
            }
        );
      network.isOnline() && queue.startSync();



      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
          // data.queueSync()

        queue.startSync()

      });

      // if (Auth.isAuthorised() && Auth.hasProfile()) {
      //   data.createLessonDBIfNotExists()
      // }
      if (navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
      // document.addEventListener('onSMSArrive', function(e){
      //   $rootScope.$broadcast('smsArrived', e);
      // });

        document.addEventListener("pause", function(){
          audio.stop('background');
        }, false);



      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }



      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      $log.debug('Yahoo');

      try{
        localStorage.myPush = ''; // I use a localStorage variable to persist the token
        $cordovaPushV5.initialize(  // important to initialize with the multidevice structure !!
            {
                android: {
                    senderID: CONSTANT.CONFIG.NOTIFICATION.SENDERID
                }
            }
        ).then(function (result) {
            $cordovaPushV5.onNotification();
            $cordovaPushV5.onError();
            $cordovaPushV5.register().then(function (resultreg) {
                localStorage.myPush = resultreg;
                $log.debug('Sending to server',resultreg)
                // SEND THE TOKEN TO THE SERVER, best associated with your device id and user
            }, function (err) {
                $log.debug("Some error occured")
                // handle error
            });
        });
      }catch(err){
        $log.warn("Need to run app on mobile to enable push notifications")
      }



      //Local Notfication
      try{
        // (function () {
          var user = User.getActiveProfileSync().data.profile;
          var ntfnText = "Hey "+user.first_name+", we are missing you. \nLet's do a lesson together.";
          $cordovaLocalNotification.schedule({
            id: 1,
            text: ntfnText,
            title: 'Let\'s play',
            every: 'minute'
          }).then(function () {
            $log.debug("Notification was placed");
            // alert("Instant Notification set");
          });
        // })();
      }catch(err){
        $log.warn(err)
      }


    });
    $ionicPlatform.on('resume', function(){
      $rootScope.$broadcast('appResume');
      $log.debug("Current state",$state.current)
      if($state.current.name === 'content.video'){
        // angular.element("#audioplayer")[0].play();
      }
         analytics.log(
            {
                name : 'APP',
                type : 'START',
                id : null
            },
            {
                time : new Date()
            }
         )
    });
    $ionicPlatform.on('pause', function(){
      $log.debug("paused")
        angular.element("#audioplayer")[0].pause();
         analytics.log(
            {
                name : 'APP',
                type : 'END',
                id : null
            },
            {
                time : new Date()
            }
         )
    });
  }
})();
