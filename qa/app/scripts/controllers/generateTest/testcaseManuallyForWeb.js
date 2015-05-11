"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("TestcaseManuallyForWebController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        var surveyName = $routeParams.filename;
        $scope.surveyName = $routeParams.filename;
        
        $scope.generateTestcase = function () {
            $('#generate-testcase-alert').removeClass()
                                         .addClass("alert alert-success");
            
            JDPAFactory.postTestCaseJSON({
                        "SurveyName": surveyName,
                        "For": "MOBILE"
                    },
                    function (data, status) {
                        $scope.message = data;
                        if (status == "201") {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-success");
                            $timeout(function () {
                            }, 8000);
                        } else {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-warning");
                        }
                        $('#save-alert').css("display", "block").fadeOut(8000);
                    }, function (err) {
                        $scope.message = "Network Error!";
                        $('#save-alert').css("display", "block").fadeOut(8000);
                    });
        };
        
    }]);