"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("ContinuePendingSurveyForMobileController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        $scope.changeSurveyNameSelect = function (surveyName){
            
        };
        

        
        JDPAFactory.getSurveyNameForPartialSurveyForMobile(function(data, status){
            $scope.surveyNames = data;
        },function(err){
        
        });

        
        
        $scope.submitQuestion = function (surveyName){
            if(surveyName){
                $location.url("ReadyPendingSurveyForMobile/"+surveyName);
            }else{
                $location.url("ContinuePendingSurveyForMobile");
            }
        };
    }]);