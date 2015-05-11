"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("GenerateForMobileController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.autoGenerate = function (){
            $location.url("generateTestcaseForMobile");
        };

        
        
        $scope.manualGenerate = function (){
            $location.url("CreateNameForManualTestcase");
        };

    }]);