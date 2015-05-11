"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("GenerateTestcaseAutoForMobileController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        JDPAFactory.getSurveyNamesForMobile(
                    function (data, status) {
                        $scope.surveyNames = data;
                    },
                    function (err) {

                }); // end of getSurveyNamesForMobile
        
        
        
        $scope.generateTestcase = function (surveyName){
            $location.url("generateTestcaseForMobile/"+surveyName);
        };

    }]);