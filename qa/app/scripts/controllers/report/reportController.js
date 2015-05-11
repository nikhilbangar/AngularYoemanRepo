"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("ReportController", ["$scope", "$http", "$routeParams", "JDPAFactory",
    function ($scope, $http, $routeParams, JDPAFactory) {
        var passCount = 0;
        var failCount = 0;
        var buildId = "TestResult_XXX-1001.json";



        // function to get latest report
        $scope.getLatestReport = function () {
            // function to handle getting report json data to show
            JDPAFactory.getReportJSON(buildId, function (data, status, headers, config) {
                $scope.reportJSON = data;
            
                for (var i = 0; i < $scope.reportJSON.TestCases.length; i++) {
                    if ($scope.reportJSON.TestCases[i].Status === "passed" || $scope.reportJSON.TestCases[i].Status === "pass" || $scope.reportJSON.TestCases[i].Status === "PASSED" || $scope.reportJSON.TestCases[i].Status === "PASS")
                        passCount = passCount + 1;
                    else
                        failCount = failCount + 1;
                }
                
                $scope.getPassedCnt = passCount;
                $scope.getFailedCnt = failCount;

                $(".btn-back").removeClass("hide").addClass("show");
                $(".btn-latest-report").removeClass("show").addClass("hide");
                $(".panel-info-report").removeClass("hide").addClass("show");
            }, function (data, status, headers, config) {});



            // function to hide back button and to show report panel
            $scope.showReportPanel = function () {
                $(".btn-back").removeClass("show").addClass("hide");
                $(".btn-latest-report").removeClass("hide").addClass("show");
                $(".panel-info-report").removeClass("show").addClass("hide");
            };



            // function to show pass in green and fail in red color
            $scope.getClass = function (status) {
                if (status === "passed" || status === "pass" || status === "PASSED" || status === "PASS") {
                    return "label-success";
                } else {
                    return "label-danger";
                }
            };


            
            // function to set row background color
            $scope.setRowBackgroundColorForFailed = function (teststepStatus) {
                if (teststepStatus == "failed") {
                    return "danger";
                }
            };

            

            // function to get testspteps data and showing on modal
            $scope.getModalForTeststapes = function (status, teststepsArray, imageUrl) {
                $scope.steps = teststepsArray;
                $scope.imagePath = imageUrl;
                $scope.setHeaderBackgroundColor = $scope.getClass(status);
            };


            
            // function to view screenshot failed testcase
            $scope.viewFailScreenshot = function () {
                JDPAFactory.getScreenshot(function (data, status) {
                }, function (err) {

                });
            };
        };

}]);