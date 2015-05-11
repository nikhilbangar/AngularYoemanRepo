"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("ReportForWebController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
        var reportData = {};
        var platformName = "";
        $scope.platforms = "";
        $scope.browsers = "";


        
        JDPAFactory.getListOfReport("Web",
            function (data, status, headers, config) {
                $scope.reportNames = data;
            },
            function (err) {});

        
        
        $scope.changeReportSelect = function (reportName) {
            if (reportName != null) {
                JDPAFactory.getPlatformsForWebReport(reportName,
                    function (data, status, headers, config) {
                        reportData = data;
                        $scope.platforms = data.Platforms;
                    $(".report-web-browser-tab-container").removeClass("show").addClass("hide");
                    },
                    function (err) {});
            }
        };



        $scope.getReportBrowserDetails = function (platform) {
            platformName = platform;
            var platformJSON = reportData[platformName];

            $scope.browsers = Object.keys(platformJSON);
            $scope.currentTab = $scope.browsers[0];

            getReportByBrowserName($scope.currentTab);

            $(".report-web-browser-tab-container").removeClass("hide").addClass("show");
        };

        
        
        // function to render all total testcases
        $scope.getTotalTestcases = function () {
            getReportByBrowserName($scope.currentTab);
        }

        
        
        // function to render all passed testcases
        $scope.getTotalPassedTestcases = function () {
            var platformJSON = reportData[platformName];
            var browserJSON = platformJSON[$scope.currentTab];
            var passedTestcasesArray = browserJSON.PassedTestCases;
            var testcaseArray = [];
            var testcaseObject = {};
            var testcaseKey = "";

            for (var index = 0; index < passedTestcasesArray.length; index++) {
                testcaseKey = passedTestcasesArray[index];
                var tc = testcaseKey.toString();
                var testcaseValue = browserJSON[testcaseKey];
                testcaseValue["TC"] = testcaseKey;
                testcaseObject[testcaseKey] = testcaseValue;
            }

            $scope.testcases = testcaseObject;
        }

        
        
        // function to render all failed testcases
        $scope.getTotalFailedTestcases = function () {
            var platformJSON = reportData[platformName];
            var browserJSON = platformJSON[$scope.currentTab];
            var failedTestcasesArray = browserJSON.FailedTestCases;
            var testcaseArray = [];
            var testcaseObject = {};
            var testcaseKey = "";

            for (var index = 0; index < failedTestcasesArray.length; index++) {
                testcaseKey = failedTestcasesArray[index];
                var tc = testcaseKey.toString();
                var testcaseValue = browserJSON[testcaseKey];
                testcaseValue["TC"] = testcaseKey;
                testcaseObject[testcaseKey] = testcaseValue;
            }

            $scope.testcases = testcaseObject;
        }



        $scope.isActiveTab = function (browser) {
            return browser == $scope.currentTab;
        }



        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab;
            getReportByBrowserName($scope.currentTab);
        }



        // function to handle tab click that has browser name
        function getReportByBrowserName(browser) {
            var testcaseArray = [];
            var platformJSON = reportData[platformName];
            var browserJSON = platformJSON[browser];
            var numberOfTestcases = Object.keys(browserJSON).length;

            $scope.failedTestcases = browserJSON.FailedTestCases.length;
            $scope.passedTestcases = browserJSON.PassedTestCases.length;
            $scope.totalTestcases = $scope.passedTestcases + $scope.failedTestcases;

            if ($scope.totalTestcases > 0) {
                $scope.centFailedTestcases = $scope.failedTestcases / $scope.totalTestcases * 100;
                $scope.centPassedTestcases = $scope.passedTestcases / $scope.totalTestcases * 100;
                $scope.centTotalTestcases = $scope.totalTestcases / $scope.totalTestcases * 100;

                angular.forEach(browserJSON, function (value, key) {
                    var newTestcaseObject = {};
                    if (key.toLowerCase() != "failedtestcases" && key.toLowerCase() != "passedtestcases") {
                        newTestcaseObject["TC"] = key;
                        newTestcaseObject["Status"] = value.Status;
                        newTestcaseObject["Duration"] = value.Duration;
                        newTestcaseObject["TestSteps"] = value.TestSteps;
                        testcaseArray.push(newTestcaseObject);
                    }
                });

                $scope.startTime = reportData.StartTime;
                $scope.endTime = reportData.EndTime;
                $scope.buildNo = reportData.BUILD_NUMBER;
                $scope.testcases = testcaseArray;

            } else {
                $scope.centFailedTestcases = 0;
                $scope.centPassedTestcases = 0;
                $scope.centTotalTestcases = 0;
                $scope.testcases = [];
            }

        }



        // function to show pass in green and fail in red color
        $scope.getClass = function (status) {
            if (status.toLowerCase() === "passed" || status.toLowerCase() === "pass") {
                return "label-success";
            } else {
                return "label-danger";
            }
        };



        // function to set row background color
        $scope.setRowBackgroundColorForFailed = function (teststepStatus) {
            if (teststepStatus.toLowerCase() == "failed") {
                return "danger";
            }
        };



        // function to get testspteps data and showing on modal
        $scope.getModalForTeststapes = function (status, teststepsArray) {
            $scope.steps = teststepsArray;
            $scope.Status = status.toLowerCase();
            $scope.setHeaderBackgroundColor = $scope.getClass(status);
        };

        
        
        // function to split expected data into two row and get expected data at first row
        $scope.getExpectedDataAtFirstRow = function (expectedData) {
            var expectedDataArray = expectedData.split("<<->>");
            var expectedDataFirstRow = expectedDataArray[0];

            return expectedDataFirstRow;
        };



        // function to split expected data into two row and get expected data at second row
        $scope.getExpectedDataAtSecondRow = function (expectedData) {
            var expectedDataArray = expectedData.split("<<->>");
            var expectedDataSecondRow = expectedDataArray[1];

            return expectedDataSecondRow;
        };

}]);