"use strict";

var qaApp = angular.module("qaApp"); 

qaApp.controller("ContinuePendingSurveyForWebController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.createNewSurvey = function (surveyName){
            $location.url("/question/Web/"+surveyName);
        };
        
    }]);