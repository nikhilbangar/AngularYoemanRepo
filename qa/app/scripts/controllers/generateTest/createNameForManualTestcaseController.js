"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("CreateNameForManualTestcaseController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.testcaseName = "";
        
        $scope.createNewTestcase = function (testcaseName){
            if(testcaseName != "")
                $location.url("/generateTestcaseManuallyForMobile/"+testcaseName);
            else
                $location.url("CreateNameForManualTestcaseController");
        };
        
    }]);