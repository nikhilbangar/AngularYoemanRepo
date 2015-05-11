"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("CreateNewSurveyForMobileController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.surveyName = "";
        
        $scope.createNewSurvey = function (surveyName){
            if(surveyName != "")
                $location.url("/question/Mobile/"+surveyName);
            else
                $location.url("createNewSurveyForMobile");
        };
        
    }]);