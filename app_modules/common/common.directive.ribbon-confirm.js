(function() {
    'use strict';

    angular
        .module('common')
        .directive('ribbonConfirm', ribbonConfirm);

    /* @ngInject */
    function ribbonConfirm(CONSTANT,$log) {
        var directive = {
            restrict: 'E',
            templateUrl: CONSTANT.PATH.COMMON + '/common.ribbon-confirm' + CONSTANT.VIEW,
            scope: {
                'message' : '=',
                'confirm' : '=',
                'dismiss' : '='
            },
            link: linkFunc,
            controller: ribbonConfirmController,
            controllerAs: 'ribbonCnfCtrl',
            bindToController: true
        };

        return directive;
    }

    function linkFunc(scope, el, attr, ctrl) {
        // scope.message = ctrl.message;
        // scope.confirm = ctrl.confirm;
        // scope.dismiss = ctrl.dismiss;
        // $log.warn('CONFIRM3',scope)
    }

    ribbonConfirmController.$inject = ['$log','$scope','User'];

    /* @ngInject */
    function ribbonConfirmController($log, $scope, User) {
        var ribbonCnfCtrl = this;
        $scope.user = User;
        $log.debug('CONFIRM',$scope);
        $scope.confirm = ribbonCnfCtrl.confirm;
        $scope.dismiss = ribbonCnfCtrl.dismiss;

        function dismiss(){
            $log.warn('CONFIRM2',$scope)
        }
    }
})();
