'use strict';

var qaApp = angular.module('qaApp');

qaApp.controller('CreateNewSurveyForWebController', ['$scope', '$location', '$log', 'JDPAFactory',
    function ($scope, $location, $log, JDPAFactory) {
        $scope.surveyName = '';
        
        $scope.createNewSurvey = function (surveyName){
            if(surveyName != '')
                $location.url('/question/Web/'+surveyName);
            else
                $location.url('createNewSurveyForWeb');
        };
        
        //$log.info(JDPAFactory.someMethod());
        
    }]);