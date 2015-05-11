'use strict';

var qaApp = angular.module('qaApp');

qaApp.controller('CreateSurveyForWebController', ['$scope', '$location', '$log', 'JDPAFactory',
    function ($scope, $location, $log, JDPAFactory) {
        $scope.startPendingSurvey = function (){
            $location.url('continuePendingSurveyForWeb');
        };
        
        $scope.createNewSurvey = function (){
            $location.url('createNewSurveyForWeb');
        };


        //$log.info(JDPAFactory.someMethod());

    }]);