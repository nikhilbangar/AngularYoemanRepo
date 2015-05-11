"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("GenerateForWebController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.autoGenerate = function (){
            $location.url("generateTestcaseForWeb");
        };

        
        
        $scope.manualGenerate = function (){
        	$location.url("CreateNameForManualTestcaseForWeb");
        };

    }]);