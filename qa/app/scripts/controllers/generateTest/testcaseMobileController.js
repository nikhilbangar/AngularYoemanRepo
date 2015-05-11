"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("TestcaseMobileController", ["$scope", "$log", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $log, $location, $routeParams, JDPAFactory) {
        $("button[name='generateTestcaseBtn']").prop("disabled", true);

        

        JDPAFactory.getSurveyNamesForMobile(
            function (data) {
                $scope.surveyNames = data;
            },
            function (err) {

            }); // end of getSurveyNamesForMobile

        
         
         $scope.surveyNameChange = function(surveyName){
            $scope.surveyName = surveyName;
             var tempObject = {
                      "SurveyName": surveyName,
                      "For": "MOBILE"
                  };
         	 
              JDPAFactory.getSpecificQuestionList(tempObject, function (data) {
             	 $scope.questionList = data;
              }, function (err) {});

         };
        


        // event to uncheck other validation checkbox if all is checked
        $("input[name='all']").change(function () {
            if ($("input[name='all']").is(":checked")) {
                // for unchecking checkbox 
                $("input[name='ask']").prop("checked", false);
                $("input[name='end-to-end-for-all-questions']").prop("checked", false);
                $("input[name='end-to-end-for-specific-questions']").prop("checked", false);

                // for disabling checkbox
                $("input[name='ask']").prop("disabled", true);
                $("input[name='end-to-end-for-all-questions']").prop("disabled", true);
                $("input[name='end-to-end-for-specific-questions']").prop("disabled", true);

                $("select[name='specificQuestionsList']").removeClass("show").addClass("hide");

                $("button[name='generateTestcaseBtn']").prop("disabled", false);
            } else {
                $("input[name='ask']").prop("disabled", false);
                $("input[name='end-to-end-for-all-questions']").prop("disabled", false);
                $("input[name='end-to-end-for-specific-questions']").prop("disabled", false);

                $("button[name='generateTestcaseBtn']").prop("disabled", true);
            }
        });



        // event to disable/enable generate testcase btn on checkbox checked/unchecked 
        $("input[name='ask']").change(function () {
            if ($("input[name='ask']").is(":checked")) {
                $("button[name='generateTestcaseBtn']").prop("disabled", false);
            } else {
                $("button[name='generateTestcaseBtn']").prop("disabled", true);
            }
        });



        $("input[name='end-to-end-for-all-questions']").change(function () {
            if ($(this).is(":checked")) {
                $("input[name='end-to-end-for-specific-questions']").prop("checked", false);
                $("button[name='generateTestcaseBtn']").prop("disabled", false);

                $("select[name='specificQuestionsList']").removeClass("show").addClass("hide");
            } else {
                $("button[name='generateTestcaseBtn']").prop("disabled", true);
            }
        });

       

        $("input[name='end-to-end-for-specific-questions']").change(function () {
            var surveyName = $("select[name='surveyName'] option:selected").text();
            var tempObject = {
                "SurveyName": surveyName,
                "For": "MOBILE"
            };

            if ($(this).is(":checked")) {
                $("input[name='end-to-end-for-all-questions']").prop("checked", false);
                $("button[name='generateTestcaseBtn']").prop("disabled", false);

                $("select[name='specificQuestionsList']").removeClass("hide").addClass("show");

            } else {
                $("button[name='generateTestcaseBtn']").prop("disabled", true);
                $("select[name='specificQuestionsList']").removeClass("show").addClass("hide");
            }
        });



        // function to click on generate testcase button
        $scope.generateTestcase = function () {
            var testcaseObjectToPost = {};
            var testcaseObjectArray = [],
                tempArray = [];

            var surveyName = $("select[name='surveyName'] option:selected").text();

            if (surveyName === "Select Survey") {
                alert("Please Select Survey...!");
                return;
            }

            $('#generate-testcase-alert').removeClass()
                .addClass("alert alert-success");

            testcaseObjectToPost["SurveyName"] = surveyName;
            testcaseObjectToPost["For"] = "MOBILE";

            if ($("input[name='all']").is(":checked")) {
                testcaseObjectArray.push($("input[name='all']").val());
            } else {

                if ($("input[name='ask']").is(":checked")) {
                    testcaseObjectArray.push($("input[name='ask']").val());
                }

                if ($("input[name='end-to-end-for-all-questions']").is(":checked")) {
                    testcaseObjectArray.push($("input[name='end-to-end-for-all-questions']").val());
                }

                if ($("input[name='end-to-end-for-specific-questions']").is(":checked")) {
                    testcaseObjectArray.push($("input[name='end-to-end-for-specific-questions']").val());
                    
                    var questionCode = $("select[name='specificQuestionsList'] option:selected").text();
                    
                    if (questionCode != "Select Question Code") {
                        tempArray.push(questionCode);
                    } else {
                        alert("Select Question Code");
                        return;
                    }
                }

            }

            testcaseObjectToPost["Validation"] = testcaseObjectArray;
            testcaseObjectToPost["SpecificQuestionList"] = tempArray;

            $log.debug("Data to post for generate testcase for mobile: " + JSON.stringify(testcaseObjectToPost));
            
            JDPAFactory.postTestCaseJSON(testcaseObjectToPost,
                function (data, status) {
                    $scope.message = data;

                    if (status == "201") {
                        $('#save-alert').removeClass()
                            .addClass("alert alert-success");
                        $timeout(function () {}, 8000);
                    } else {
                        $('#save-alert').removeClass()
                            .addClass("alert alert-warning");
                    }
                    $('#save-alert').css("display", "block").fadeOut(8000);
                },
                function (err) {
                    $scope.message = "Network Error!";
                    $('#save-alert').css("display", "block").fadeOut(8000);
                });
        };

    }]);