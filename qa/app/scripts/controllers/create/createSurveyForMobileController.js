"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("CreateSurveyForMobileController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.startPendingSurvey = function (){
            $location.url("continuePendingSurveyForMobile");
        };
        
        $scope.createNewSurvey = function (){
            $location.url("createNewSurveyForMobile");
        };

    }]);