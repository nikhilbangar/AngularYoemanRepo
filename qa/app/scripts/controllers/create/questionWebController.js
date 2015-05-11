"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("QuestionWebController", ["$scope", "$routeParams", "JDPAFactory",
    function ($scope, $routeParams, JDPAFactory) {
        $scope.QuestionNumber = "1";
        $scope.text_type_checkbox = false;
        $scope.response = false;
        var startQuestionKey = "";
        var surveyName = $routeParams.filename;
        var QuestionObject = {};
        var flag = false;
        var questionTitle = null;
        var wrapper = $(".form-horizontal>.form-group-input-box");
        var inputBoxCounter = 0;
        var SelectionType = "SimpleRadioOrCheckbox";
        $scope.questionButton = true;



        /**
         *
         * For Simple Question
         *
         **/


        // function to handle response adding [press button]
        $scope.generateResponses = function () {
            var noOfResponse = $("#noOfResponse>input").val();
            $scope.questionButton = false;
            var arrInputIndex = [];
            var label = 1;

            for (var index = 0; index < noOfResponse; index++) {
                // with delete option UI
                var newRow = '<div class="form-group dynamic-responses" id="response-id-' + index + '"><label for="inputPassword3" class="col-sm-2 control-label"></label><div class="col-sm-9" style="padding:0px"><div class="col-md-4"><div class="input-group"><input type="text" for="input-label" class="form-control" placeholder="Response label" required><span class="btn input-group-addon"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-md-4 add_text_btn_container"><button id="one" class="btn btn-default add_response_button form-control" style="display:none" >Add Text</button></div><div class="col-md-4 response-value-container" style="display:none"><input type="text" for="input-value" class="form-control" style="margin-left:0px;" placeholder="Response value" required></div></div></div>';

                // Add the new dynamic row after the last row
                $('#response-container').append(newRow);
            } // end of for loop

            if ($scope.text_type_checkbox) {
                $("#response-container .add_response_button").show();
            }
        }; // end of generateResponses 

        
        
        // To Event delete Response
        $("#response-container").on("click", ".glyphicon-remove", function (e) {
                e.preventDefault();
                $(this).closest(".form-group").remove();
        });

        
        
        // function to handle previous question button    
        $scope.previousQuestion = function () {}; // end of previousQuestion



        // function to handle isText checkbox
        $scope.change = function () {
            if ($scope.text_type_checkbox) {
                $("#response-container .add_response_button").removeClass("hide").addClass("show");
                SelectionType = "SimpleTextbox";
            }
            if (!$scope.text_type_checkbox) {
                $("#response-container .form-group .response-value-container").hide();
                $("#response-container .add_response_button").removeClass("show").addClass("hide");
                SelectionType = "SimpleRadioOrCheckbox";
            }

        }; // end of change



        // function to handle showing response value inputbox on add text button click event
        $("#response-container").on("focus", ".add_response_button", function (e) {
            e.preventDefault();

            $(this).click(function () {
                $(this).parent("div").siblings(".response-value-container").show();
            });
        }); // end of focus event



        // function for handling question generation
        $scope.saveQuestion = function () {
            if (validateForEmptyInput()) {
                getInputValue();
                
                if (Object.keys(QuestionObject).length != 0) {
                    JDPAFactory.postQuestionJSON({
                            "Survey Name": surveyName,
                            "For": "WEB",
                            "Data": QuestionObject
                        },
                        function (data, status) {
                            $scope.message = data;

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
                if ($scope.QuestionNumber == 1) {
                    startQuestionKey = $scope.question_code;
                }

                $scope.QuestionNumber++;
                getInputValue();
            } else {
            }
        }; // end of nextQuestion



        // function to handle empty input
        function validateForEmptyInput() {
                if ($scope.question_code != "") {
                    flag = true;
                } else {
                    flag = false;
                    alert("Enter question code!");
                }
                return flag;
            } // end of validateForEmptyInput



        // common utility function to get values from input box and create question JSON Object
        function getInputValue() {
                var OneQuestionObjectPerQuestion = {};
                var validationProgValueObject = {};
                var ResponsesPerQuestionObject = {};
                var responseKeyObject = {};
                var responseObject = {};
                var responseIndex = 1;

                // event to iterate through each form group
                $("#response-container .form-group").each(function (index, element) {
                    var input_label = $(this).find("input[for='input-label']").val();
                    var input_value = $(this).find("input[for='input-value']").val();

                    if(input_label != "")
                    {
                         responseKeyObject[responseIndex] = getResponseValueObject(input_label, input_value);
                         responseIndex++;
                    }

                });

                OneQuestionObjectPerQuestion["Question"] = $scope.question;
                OneQuestionObjectPerQuestion["SelectionType"] = SelectionType;

                // validation for PROG
                if ($("input[name='Max']").val() != "" && $("input[name='Min']").val() != "") {
                    validationProgValueObject["MAX"] = $("input[name='Max']").val();
                    validationProgValueObject["MIN"] = $("input[name='Min']").val();
                    OneQuestionObjectPerQuestion["PROG_Validation"] = validationProgValueObject;
                } else
                if ($("input[name='Max']").val() != "") {
                    validationProgValueObject["MAX"] = $("input[name='Max']").val();
                    OneQuestionObjectPerQuestion["PROG_Validation"] = validationProgValueObject;
                } else
                if ($("input[name='Min']").val() != "") {
                    validationProgValueObject["MIN"] = $("input[name='Min']").val();
                    OneQuestionObjectPerQuestion["PROG_Validation"] = validationProgValueObject;
                }

                if ($("input[name='prog-single-response']").is(":checked")) {
                    OneQuestionObjectPerQuestion["PROG_Single_Response"] = true;
                }

                if ($("input[name='prog-fixed']").is(":checked")) {
                    OneQuestionObjectPerQuestion["PROG_Fixed"] = true;
                }

                if ($("input[name='prog-forced']").is(":checked")) {
                    OneQuestionObjectPerQuestion["PROG_Force"] = true;
                }

                if ($("input[name='prog-ask']").val() != "") {
                    OneQuestionObjectPerQuestion["PROG_Ask"] = $("input[name='prog-ask']").val();
                }
                // end of prog validation


                OneQuestionObjectPerQuestion["Responses"] = responseKeyObject;
                OneQuestionObjectPerQuestion["Condition"] = $scope.condition;

                questionTitle = $(".question-title-web").text();

                QuestionObject["StartQuestionKey"] = startQuestionKey;
                QuestionObject[$scope.question_code] = OneQuestionObjectPerQuestion;

                clearQuestionPanel();
            } // end of getInputValue


        // function to create response value object 
        function getResponseValueObject(label, value) {
            var responseValueObject = {};
            responseValueObject["value"] = label;

            if (value != "") {
                responseValueObject["input"] = "textbox";
            } else {
                responseValueObject["input"] = "radio";
            }
            return responseValueObject;
        }


        // function to clear the question panel
        function clearQuestionPanel() {
            $("#response-container").empty();
            $("#question-textarea").val("");
            $("#condition-textarea").val("");
            $("#no-of-response-input").val("");
            $("input[name='prog-single-response']").prop("checked", true);
            $("input[name='prog-fixed']").prop("checked", true);
            $("input[name='prog-forced']").prop("checked", true);
            $("input[name='Min']").val("");
            $("input[name='Max']").val("");
            $("input[name='prog-ask']").val("");
            $(".validation-prog").removeClass("show").addClass("hide");
            $(".prog-for-no-validation-container").removeClass("hide").addClass("show");
            $("#no-of-list-input").val("");
            $scope.question_code = "";
            $scope.text_type_checkbox = false;
            SelectionType = "SimpleRadioOrCheckbox";
        }



        /**
         *
         * For List Question
         *
         **/



        // working for all input box
        $(".table-for-list tbody").on("keydown", "input:last-child", function (event) {
            if (event.which == 9) {
                var addInput = '<input type="text" class="form-control">';
                $(this).parent("td").find("input:last-child").after(addInput);
            }
        });



        // function to save list question
        $scope.saveQuestionForList = function () {
            if(validateForEmptyInput()){
                getInputValueForList();

                if (Object.keys(QuestionObject).length != 0) {
                    JDPAFactory.postQuestionJSON({
                            "Survey Name": surveyName,
                            "For": "WEB",
                            "Data": QuestionObject
                        },
                        function (data, status) {
                            $scope.message = data;

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
            }else{
                alert("Check your input!");
            }
        };


        // function to generate final json to send to db
        function getInputValueForList() {
            var OneQuestionObjectPerQuestion = {};
            var responseKeyObject = {};
            var validationProgValueObject = {};
            var listValueObejct = {};
            var questionTitle = "";
            var columnCount = $(".table-for-list thead th").length;

            // for L1 L2 ....
            $(".table-for-list thead th").each(function () {
                var rowIndex = 1;
                var listLevel = $(this).find("input").attr("name");
                var columnTitle = $(this).find("input").val();
                var responseValueObject = {};

                // for each item in column
                $(".table-for-list tbody td[role='" + listLevel + "']").find("input").each(function () {
                    var singleColumnItemValueObject = {};
                    responseValueObject = {};
                    var columnItem = $(this).val();
                    if (columnItem != "") {
                        singleColumnItemValueObject["Name"] = columnTitle;
                        singleColumnItemValueObject["value"] = columnItem;

                        responseValueObject["value"] = singleColumnItemValueObject;
                        responseValueObject["input"] = "checkbox";

                        responseKeyObject[listLevel + "_" + rowIndex] = responseValueObject;
                        rowIndex = rowIndex + 1;
                    }
                });
            });

            // event to create listValueObject object
            $(".table-for-list tbody td").each(function () {
                var columnName = $(this).attr("role");
                var columnItemCount = 0;
                $("td[role='" + columnName + "']").find("input").each(function () {
                    if ($(this).val() != "") {
                        columnItemCount = columnItemCount + 1;
                    }
                });

                listValueObejct[columnName] = columnItemCount.toString();
            });

            listValueObejct["Column_Count"] = columnCount.toString();


            OneQuestionObjectPerQuestion["Question"] = $scope.question;
            OneQuestionObjectPerQuestion["SelectionType"] = "SimpleList";
            OneQuestionObjectPerQuestion["List"] = listValueObejct;

            // validation for PROG
            if ($("input[name='Max']").val() != "" && $("input[name='Min']").val() != "") {
                validationProgValueObject["MAX"] = $("input[name='Max']").val();
                validationProgValueObject["MIN"] = $("input[name='Min']").val();
                OneQuestionObjectPerQuestion["PROG_Validation"] = validationProgValueObject;
            } else
            if ($("input[name='Max']").val() != "") {
                validationProgValueObject["MAX"] = $("input[name='Max']").val();
                OneQuestionObjectPerQuestion["PROG_Validation"] = validationProgValueObject;
            } else
            if ($("input[name='Min']").val() != "") {
                validationProgValueObject["MIN"] = $("input[name='Min']").val();
                OneQuestionObjectPerQuestion["PROG_Validation"] = validationProgValueObject;
            }

            if ($("input[name='prog-single-response']").is(":checked")) {
                OneQuestionObjectPerQuestion["PROG_Single_Respose"] = true;
            }

            if ($("input[name='prog-fixed']").is(":checked")) {
                OneQuestionObjectPerQuestion["PROG_Fixed"] = true;
            }

            if ($("input[name='prog-forced']").is(":checked")) {
                OneQuestionObjectPerQuestion["PROG_Force"] = true;
            }

            if ($("input[name='prog-ask']").val() != "") {
                OneQuestionObjectPerQuestion["PROG_Ask"] = $("input[name='prog-ask']").val();
            }
            // end of prog validation

            OneQuestionObjectPerQuestion["Responses"] = responseKeyObject;

            questionTitle = $(".question-title-web").text();

            QuestionObject["StartQuestionKey"] = startQuestionKey;
            QuestionObject[$scope.question_code] = OneQuestionObjectPerQuestion;

            clearQuestionPanelForList();
            return QuestionObject;
        }



        // function to generate list
        $scope.generateList = function () {
            var noOfList = $("#noOfList>input").val();
            var tempNumberOfList = Number(noOfList);
            var noOfColumns = $(".table-for-list thead tr th").length;

            for (var listIndex = 0; listIndex < tempNumberOfList - 1; listIndex++) {
                noOfColumns = noOfColumns + 1;
                var listTitle = '<th><input type="text" placeholder="Title" name="L' + noOfColumns + '" class="form-control"></th>';
                var listColumn = '<td scope="row"  role="L' + noOfColumns + '"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"><input type="text" class="form-control"></td>';

                $(".table-for-list thead tr th:last").after(listTitle);
                $(".table-for-list tbody tr td:last").after(listColumn);
            }
        };



        // event to change question type select box
        $('select[name="question-type-select"]').change(function () {
            if ($(this).val() == "simple question") {
                $(".list-question-container-web").removeClass("show").addClass("hide");
                $(".simple-question-container-web").removeClass("hide").addClass("show");
            } else
            if ($(this).val() == "list question") {
                $(".list-question-container-web").removeClass("hide").addClass("show");
                $(".simple-question-container-web").removeClass("show").addClass("hide");
            }
        });



        // function to handle next Question button
        $scope.nextQuestionList = function () {
            if (validateForEmptyInput()) {
                if ($scope.QuestionNumber == 1) {
                    startQuestionKey = $scope.question_code;
                }
                $scope.QuestionNumber++;
                getInputValueForList();
            } else {
                alert("Check your input!");
            }
        }; // end of nextQuestion


        // function to clear the question panel
        function clearQuestionPanelForList() {
            $("#response-container").empty();
            $("#question-textarea").val("");
            $("#condition-textarea").val("");
            $("#no-of-response-input").val("");
            $("input[name='prog-single-response']").prop("checked", true);
            $("input[name='prog-fixed']").prop("checked", true);
            $("input[name='prog-forced']").prop("checked", true);
            $("input[name='Min']").val("");
            $("input[name='Max']").val("");
            $("input[name='prog-ask']").val("");
            $(".validation-prog").removeClass("show").addClass("hide");
            $(".prog-for-no-validation-container").removeClass("hide").addClass("show");
            $("#no-of-list-input").val("");
            $scope.text_type_checkbox = false;
            $scope.question_code = "";
            SelectionType = "SimpleRadioOrCheckbox";

            $(".table-for-list input").val("");
            var numberOfHeader = $(".table-for-list thead th").length;

            if (numberOfHeader > 1) {
                for (var listIndex = 0; listIndex < numberOfHeader - 1; listIndex++) {
                    $(".table-for-list thead th:last").remove();
                    $(".table-for-list tbody td:last").remove();
                }
            }
        }




        /**
         *
         * For PROG
         *
         **/



        // event to toggle prog validation
        $('.validation-prog-btn').click(function () {
            $(".validation-prog").removeClass("hide").addClass("show");
            $("input[name='prog-single-response']").prop("checked", false);
            $("input[name='prog-fixed']").prop("checked", false);
            $("input[name='prog-forced']").prop("checked", false);
            $(".prog-for-no-validation-container").removeClass("show").addClass("hide");
        });


}]);