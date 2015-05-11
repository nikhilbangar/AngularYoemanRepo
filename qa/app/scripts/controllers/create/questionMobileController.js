"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("QuestionMobileController", ["$scope", "$routeParams", "JDPAFactory",
    function ($scope, $routeParams, JDPAFactory) {
        $scope.QuestionNumber = "1";
        $scope.text_type_checkbox = false;
        $scope.prog_ask = "";
        var surveyName = $routeParams.filename;
        var QuestionObject = {};
        var flag = false;
        var questionTitle = null;
        var SelectionType = "SimpleRadioOrCheckbox";
        var startQuestionKey = "";



        // function to handle response adding [press button]
        $scope.generateResponses = function () {
            var noOfResponse = $("#noOfResponse>input").val();
            var label = 1;

            for (var index = 0; index < noOfResponse; index++) {
                // with delete response ability
                var newRow = '<div class="form-group dynamic-responses" id="response-id-' + index + '"><label for="inputPassword3" class="col-sm-2 control-label"></label><div class="col-sm-9" style="padding:0px"><div class="col-md-4"><div class="input-group"><input type="text" for="input-label" class="form-control" placeholder="Response label" required><span class="btn input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-md-4 add_text_btn_container"><button id="one" class="btn btn-default add_response_button form-control" style="display:none">Add Level</button></div><div class="col-md-4 response-value-container" style="display:none"></div></div></div>';
                
                
                $('#response-container').append(newRow);
            } // end of for loop

            if ($scope.text_type_checkbox) {
                $("#response-container .add_response_button").show();
            }
        }; // end of generateResponses 
        
        
        
        // event to delete response at level 1
        $("#response-container").on("click", ".btn-delete-at-level1", function (e) {
                e.preventDefault();
                $(this).closest(".form-group").remove();
        });
        
        
        
         // event to delete response at level 2
        $("#response-container").on("click", ".btn-delete-at-level2", function (e) {
                e.preventDefault();
                $(this).closest(".response-level2-container").remove();
        });



        // function to handle previous question button    
        $scope.previousQuestion = function () {}; // end of previousQuestion



        // function to handle isMultilevel checkbox
        $scope.change = function () {
            if ($scope.text_type_checkbox) {
                $("#response-container .add_response_button").removeClass("hide").addClass("show");
                SelectionType = "MultiLevelRadio";
            }
            if (!$scope.text_type_checkbox) {
                $("#response-container .form-group .response-value-container").hide();
                $("#response-container .add_response_button").removeClass("show").addClass("hide");
                SelectionType = "SimpleRadioOrCheckbox";
            }
        }; // end of change



        // function to handle showing response value inputbox on add level button click event
        $("#response-container").on("click", ".add_response_button", function (e) {
            e.preventDefault();
            
            $(".response-level-prog-checkbox").removeClass("hide").addClass("show");
            
            var newInputElement = '<div class="response-level2-container"><div class="input-group"  style="margin-left:0px;"><input type="text" for="input-value" class="form-control" placeholder="Response value"><span class="btn input-group-addon btn-delete-at-level2"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div><div class="response-level-ask-container hide"><div class="input-group" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input type="text" class="form-control" aria-describedby="basic-addon2"></div></div></div>';
            
            $(this).parent("div").siblings(".response-value-container").show();
            $(this).parent("div").siblings(".response-value-container").append(newInputElement);
            
            // checking each time response prog is checked to show/enable ask at response level
            if($("input[name='mobile-prog-ask']:checked").val() === "response-level-prog"){
                $(".response-level-ask-container").removeClass("hide").addClass("show");
            }
        }); // end of click event



        // function for handling question generation
        $scope.saveQuestion = function () {
            if (validateForEmptyInput()) {
                getInputValue();

                if (Object.keys(QuestionObject).length != 0) {
                    JDPAFactory.postQuestionJSON({
                            "Survey Name": surveyName,
                            "For": "MOBILE",
                            "Data": QuestionObject
                        },
                        function (data, status) {
                            $scope.message = "inserted!";

                            if (status == "201") {
                                $('#save-alert').removeClass()
                                    .addClass("alert alert-success");
                                $timeout(function () {
                                }, 4000);
                            } else {
                                $('#save-alert').removeClass()
                                    .addClass("alert alert-warning");
                            }
                            $('#save-alert').css("display", "block").fadeOut(4000);
                        },
                        function (err) {
                            $scope.message = "Network Error!";
                            $('#save-alert').css("display", "block").fadeOut(4000);
                        });
                }
            } else {
                alert("Check your input!");
            }
        }; // end of saveQuestion



        // function to handle next Question button
        $scope.nextQuestion = function () {
            if (validateForEmptyInput()) {
                if($scope.QuestionNumber == 1) {
                    startQuestionKey = $scope.question_code;
                }
                
                $scope.QuestionNumber++;
                
                getInputValue();
                
                $("input[name='mobile-prog-ask']:first").prop("checked",true);
                $(".question-level-ask-container").removeClass("hide").addClass("show");
                $(".response-level-prog-checkbox").removeClass("show").addClass("hide");
            } else {
                alert("Check your input!");
            }
        }; // end of nextQuestion



        // function to handle empty input
        function validateForEmptyInput() {
            var question_textarea = $("#question-textarea").val(); // question textarea should not empty
            var response_input_label_flag = true; // flag to check response input label not to be blank
            var response_container_length = $("#response-container").children().length; // to find no. of elements in response-container
            var prog_ask_at_question_level_flag = false; 
            
            // condition for prog ask at question level not empty
            if($("input[name='mobile-prog-ask']:first").is(":checked")){
                if ($(".question-level-ask-container input").val() != ""){
                    prog_ask_at_question_level_flag = true;
                }
            }else
            if($(".response-level-prog-checkbox input").is(":checked")){
                prog_ask_at_question_level_flag = true;
            }    
            
            // event to handle response input to check is not empty
            $("#response-container .form-group").each(function (index, element) {
                var input_label = $(this).find("input[for='input-label']").val();
                if (input_label == "") {
                    response_input_label_flag = false;
                }
            }); // end of #response-container .form-group
            
            return true;
        } // end of validateForEmptyInput



        // common utility function to get values from input box and create question JSON Object
        function getInputValue() {
            var OneQuestionObjectPerQuestion = {};
            var ResponsesPerQuestionObject = {};
            var responseKeyObject = {};
            var responseObject = {};
            var responseIndex = 1;
            var no_of_responses = $("#no-of-response-input").val();

            if (no_of_responses == "") {
                SelectionType = "NoResponse";
            }

            // event to loop through each form group
            $("#response-container .form-group").each(function (index, element) {
                var input_label = $(this).find("input[for='input-label']").val();
                var input_value = $(this).find("input[for='input-value']").val();

                responseKeyObject[responseIndex] = getResponseValueObject($(this), input_label, input_value);
                responseIndex++;
            });

            OneQuestionObjectPerQuestion["Question"] = $scope.question;
            OneQuestionObjectPerQuestion["SelectionType"] = SelectionType;
            
            if($('input[name="mobile-prog-ask"]:checked').val() === "question-level-prog"){
                OneQuestionObjectPerQuestion["Flow"] = "Free"; 
                OneQuestionObjectPerQuestion["PROG_Ask"] = $scope.prog_ask;
            }else
            if($('input[name="mobile-prog-ask"]:checked').val() === "response-level-prog"){
                OneQuestionObjectPerQuestion["Flow"] = "Distribute";
            }    
            
            OneQuestionObjectPerQuestion["Responses"] = responseKeyObject;

            questionTitle = $scope.question_code;
            QuestionObject["StartQuestionKey"] = startQuestionKey;
            QuestionObject[questionTitle] = OneQuestionObjectPerQuestion;

            clearQuestionPanel();
        } // end of getInputValue



        // function to create response value object 
        function getResponseValueObject(parent_this, input_label, input_value) {
            var responseValueObject = {};
            var responseValue = {};
            var responseValueArray = [];

            if (SelectionType == "MultiLevelRadio") {
                responseValue["value"] = input_label;
                responseValue["input"] = "radio";
                responseValueObject["L1"] = responseValue;

                // event to loop through each L2
                parent_this.find("input[for='input-value']").each(function () {
                    responseValue = {};
                    responseValue["value"] = $(this).val();
                    responseValue["input"] = "radio";
                    responseValue["PROG_Ask"] = $(this).next(".response-level-ask-container").find("input").val();
                    responseValueArray.push(responseValue);
                });
                responseValueObject["L2"] = responseValueArray;
                responseValueArray = [];
            } else
            if (SelectionType = "SimpleRadioOrCheckbox") {
                responseValueObject["value"] = input_label;
                responseValueObject["input"] = "radio";
            }

            return responseValueObject;
        }



        // function to clear the question panel
        function clearQuestionPanel() {
            $("#response-container").empty();
            $("#question-textarea").val("");
            $("#no-of-response-input").val("");
            $scope.text_type_checkbox = false;
            SelectionType = "SimpleRadioOrCheckbox";
            $scope.prog_ask = "";
            $scope.question_code = "";
        }
        
        
        
        /**
        *
        *   For prog
        *
        */
        
        
        
        $("input[name='mobile-prog-ask']").change(function(e){
            if($(this).val() === "question-level-prog"){
                $(".question-level-ask-container").removeClass("hide").addClass("show");
                $(".response-level-ask-container").removeClass("show").addClass("hide");
                
            }else
            if($(this).val() === "response-level-prog"){
                $(".question-level-ask-container").removeClass("show").addClass("hide");
                $(".response-level-ask-container").removeClass("hide").addClass("show");
                
            }    
        });

}]);