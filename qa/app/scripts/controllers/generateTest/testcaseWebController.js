"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("TestcaseWebController", ["$scope", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $location, $routeParams, JDPAFactory) {
	$scope.surveyName = null;

        
        
        JDPAFactory.getSurveyNamesForWeb(
                function (data) {
                    $scope.surveyNames = data;
                },
                function (err) {

                }); // end of getSurveyNamesForWeb
        
        
         
        $scope.surveyNameChange = function(surveyName){
            $scope.surveyName = surveyName;
        	var tempObject = {
                     "SurveyName": surveyName,
                     "For": "WEB"
                 };

             JDPAFactory.getSpecificQuestionList(tempObject, function (data) {
            	 $scope.questionList = data;
             }, function (err) {});
        };
        
        
        
        // event to disable generate testcase button at page load
        $("button[name='generateTestcaseBtn']").prop("disabled",true);
        
        
        
        // event to uncheck other validation checkbox if all is checked
        $("input[name='all']").change(function(){
            if($("input[name='all']").is(":checked")){
                // for unchecking checkbox 
                $("input[name='free-flow']").prop("checked",false);
                $("input[name='forced']").prop("checked",false);
                $("input[name='response-dependent']").prop("checked",false);
                $("input[name='validation-min']").prop("checked",false);
                $("input[name='validation-max']").prop("checked",false);
                $("input[name='validation-maxmore']").prop("checked",false);
                $("input[name='ask']").prop("checked", false);
                $("input[name='end-to-end-for-all-questions']").prop("checked", false);
                $("input[name='end-to-end-for-specific-questions']").prop("checked", false);

                
                // for disabling checkbox
                $("input[name='free-flow']").prop("disabled",true);
                $("input[name='forced']").prop("disabled",true);
                $("input[name='response-dependent']").prop("disabled",true);
                $("input[name='validation-min']").prop("disabled",true);
                $("input[name='validation-max']").prop("disabled",true);
                $("input[name='validation-maxmore']").prop("disabled",true);
                $("input[name='ask']").prop("disabled", true);
                $("input[name='end-to-end-for-all-questions']").prop("disabled", true);
                $("input[name='end-to-end-for-specific-questions']").prop("disabled", true);
                
                // for showing and hiding testcase panel
                $("div[name='specificQuestionsList']").removeClass("show").addClass("hide");
                
                $("button[name='generateTestcaseBtn']").prop("disabled",false);
            }else{
                $("input[name='free-flow']").prop("disabled",false);
                $("input[name='forced']").prop("disabled",false);
                $("input[name='response-dependent']").prop("disabled",false);
                $("input[name='validation-min']").prop("disabled",false);
                $("input[name='validation-max']").prop("disabled",false);
                $("input[name='validation-maxmore']").prop("disabled",false);
                $("input[name='ask']").prop("disabled", false);
                $("input[name='end-to-end-for-all-questions']").prop("disabled", false);
                $("input[name='end-to-end-for-specific-questions']").prop("disabled", false);
                
                $("button[name='generateTestcaseBtn']").prop("disabled",true);
            }
        });
        
        
        
        // event to disable/enable generate testcase btn on checkbox checked/unchecked 
        $("input[name='forced']").change(function(){
            if($("input[name='forced']").is(":checked")){
                $("button[name='generateTestcaseBtn']").prop("disabled",false);
            }else{
                $("button[name='generateTestcaseBtn']").prop("disabled",true);
            }
        });
        
        
        
        // event to disable/enable generate testcase btn on checkbox checked/unchecked
        $("input[name='validation-min']").change(function(){
            if($("input[name='validation-min']").is(":checked")){
                $("button[name='generateTestcaseBtn']").prop("disabled",false);
            }else{
                $("button[name='generateTestcaseBtn']").prop("disabled",true);
            }
        });
        
        
        
        // event to disable/enable generate testcase btn on checkbox checked/unchecked
        $("input[name='validation-max']").change(function(){
            if($("input[name='validation-max']").is(":checked")){
                $("button[name='generateTestcaseBtn']").prop("disabled",false);
            }else{
                $("button[name='generateTestcaseBtn']").prop("disabled",true);
            }
        });
        
        
        
        // event to disable/enable generate testcase btn on checkbox checked/unchecked
        $("input[name='validation-maxmore']").change(function(){
            if($("input[name='validation-maxmore']").is(":checked")){
                $("button[name='generateTestcaseBtn']").prop("disabled",false);
            }else{
                $("button[name='generateTestcaseBtn']").prop("disabled",true);
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
                $("div[name='specificQuestionsList']").removeClass("show").addClass("hide");
            } else {
                $("button[name='generateTestcaseBtn']").prop("disabled", true);
            }
        });

      

        $("input[name='end-to-end-for-specific-questions']").change(function () {
            if ($(this).is(":checked")) {
                $("input[name='end-to-end-for-all-questions']").prop("checked", false);
                $("button[name='generateTestcaseBtn']").prop("disabled", false);
                $("div[name='specificQuestionsList']").removeClass("hide").addClass("show");
            } else {
                $("button[name='generateTestcaseBtn']").prop("disabled", true);
                $("div[name='specificQuestionsList']").removeClass("show").addClass("hide");
            }
        });
        

        
        // function for generating testcases based on provided validation
        $scope.generateTestcase = function () {
            var testcaseObjectToPost = {};
            var testcaseObjectArray = [];
            var tempArray = [];
            $('#generate-testcase-alert').removeClass()
                                         .addClass("alert alert-success");
            
            if ( $scope.surveyName === null) {
                alert("Please Select Survey...!");
                return;
            }
            
            testcaseObjectToPost["SurveyName"] =  $scope.surveyName;
            testcaseObjectToPost["For"] = "WEB";
            
            if($("input[name='all']").is(":checked")){
                testcaseObjectArray.push($("input[name='all']").val());
            }else{
                
                if($("input[name='forced']").is(":checked")){
                    testcaseObjectArray.push($("input[name='forced']").val());
                }
                
                if($("input[name='validation-min']").is(":checked")){
                    testcaseObjectArray.push($("input[name='validation-min']").val());
                }
                
                if($("input[name='validation-max']").is(":checked")){
                    testcaseObjectArray.push($("input[name='validation-max']").val());
                }
                
                if($("input[name='validation-maxmore']").is(":checked")){
                    testcaseObjectArray.push($("input[name='validation-maxmore']").val());
                }
                
                if ($("input[name='ask']").is(":checked")) {
                    testcaseObjectArray.push($("input[name='ask']").val());
                }

                if ($("input[name='end-to-end-for-all-questions']").is(":checked")) {
                    testcaseObjectArray.push($("input[name='end-to-end-for-all-questions']").val());
                }

                if ($("input[name='end-to-end-for-specific-questions']").is(":checked")) {
                    testcaseObjectArray.push($("input[name='end-to-end-for-specific-questions']").val());
                    
                    if($("input[name='questionCode']:checked").length < 1){
                    	alert("Select Question Code");
                        return;
                    }else{
                    	$("input[name='questionCode']:checked").each(function(){
                    		var questionCode = $(this).val();
                    		tempArray.push(questionCode);
                    	});
                    	
                    }	
                }
            }
            
            testcaseObjectToPost["Validation"] = testcaseObjectArray;
            testcaseObjectToPost["SpecificQuestionList"] = tempArray;
            
            JDPAFactory.postTestCaseJSON(testcaseObjectToPost,
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
                    }
            );
            
        };
        
    }]);