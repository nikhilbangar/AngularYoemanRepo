"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("CreateNameForManualTestcaseForWebController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.testcaseName = "";
        
        $scope.createNewTestcase = function (testcaseName){
            if(testcaseName != "")
                $location.url("/generateTestcaseManuallyForWeb/"+testcaseName);
            else
                $location.url("CreateNameForManualTestcaseForWeb");
        };
        
    }]);