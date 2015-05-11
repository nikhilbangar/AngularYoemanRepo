"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("GenerateTestcaseAutoForWebController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        JDPAFactory.getSurveyNamesForWeb(
                    function (data, status) {
                        $scope.surveyNames = data;
                    },
                    function (err) {

                }); // end of getSurveyNamesForWeb
        
        
        
        $scope.generateTestcase = function (surveyName){
            $location.url("generateTestcaseForWeb/"+surveyName);
        };

    }]);