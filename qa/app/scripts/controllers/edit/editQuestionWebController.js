"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("EditQuestionWebController", ["$scope", "$http", "JDPAFactory", function ($scope, $http, JDPAFactory) {
    $scope.message = "Testcase";
    var testcaseData = [];
    $scope.testcases = [];
    var QuestionObject = {};
    var surveyNameFromSelect = "";
    var testcaseName = "";
    var questionJSONData = "";
    var Gobal_QuestionJson = {};
    $scope.questionTitle = "";
    $scope.name = "Survey Name";
    $scope.condition = "";
    $scope.totalNumberOfQuestions = "";
    var SelectionType = "SimpleRadioOrCheckbox";



    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForWeb(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {

        }); // end of getSurveyNames



    // function to handle surveyname selection box
    $scope.changeSurveyNameSelect = function (surveyName) {
        surveyNameFromSelect = surveyName;
        if (surveyName) {
            // function to handle fetching survey names from db
            JDPAFactory.getQuestionJSONToEdit({
                    "SurveyName": surveyName,
                    "For": "WEB"
                },
                function (data, status) {
                    questionJSONData = data;
                    $scope.listOfQuestionKeys = Object.keys(data);
                    $scope.totalNumberOfQuestions = Object.keys(data).length - 1;
                },
                function (err) {});
        }
    };



    // function to handle showing question data on view from db
    $scope.getQuestionJSONToEdit = function (questionKeyCode) {
        if ($("select[name='question-key-select']").val() === "") {
            alert("Please select any question!");

        } else {
            var questionJSON = questionJSONData[questionKeyCode];
            Gobal_QuestionJson = questionJSONData[questionKeyCode];

            var selectionType = questionJSON.SelectionType;

            $scope.questionTitle = $scope.questionKeyCode;
            $scope.question = questionJSON.Question;

            switch (selectionType) {
            case "SimpleRadioOrCheckbox":
                showQuestionDataForSimpleQuestion(questionKeyCode);
                break;
            case "SimpleList":
                showQuestionDataForSimpleList(questionKeyCode);
                break;
            default:
                ;
            }
        }
    };


    //function to show question data for simple question
    function showQuestionDataForSimpleQuestion(questionKeyCode) {
        $scope.text_type_checkbox = false;
        var totalNumberOfQuestion = Object.keys(questionJSONData).length;
        var questionJSON = questionJSONData[questionKeyCode];
        $scope.condition = questionJSON.Condition;
        $('#response-container').empty();

        if (Object.keys(questionJSON.Responses).length >= 1) {
            angular.forEach(questionJSON.Responses, function (value, key) {
                var input_text = value.input_text;
                var input_label_value = value.value;
                var input_type = value.input;
                var input_text_value = "";
                var index = 0;

                if (input_type == "Textbox") {
                    input_text_value = input_text;
                } else
                if (input_type == "radio") {
                    input_text_value = "";
                }

                var newRow = '<div class="form-group dynamic-responses" id="response-id-' + index + '"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style="padding:0px"><div class="col-md-4"><textarea for="input-label" class="form-control">' + input_label_value + '</textarea></div><div class="col-md-4 add_text_btn_container"><button id="one" class="btn btn-default add_response_button form-control" style="display:none">Add Text</button></div><div class="col-md-4 response-value-container" style="display:none"><textarea for="input-value" class="form-control" style="margin-left:0px;">' + input_text_value + '</textarea></div></div></div>';

                // Add the new dynamic row after the last row
                $('#response-container').append(newRow);
                index = index + 1;

                $(".question-edit-container").removeClass("hide").addClass("show");
                $(".simple-question-container-web").removeClass("hide").addClass("show");
                $(".list-question-container-web").removeClass("show").addClass("hide");
            }); // end of for-each loop
        } else {
            $('.list-question-container-web').removeClass("show").addClass("hide");
            $('.simple-question-container-web').removeClass("hide").addClass("show");

        }



    }



    //function to show question data for list question
    function showQuestionDataForSimpleList(questionKeyCode) {
        var questionJSON = questionJSONData[questionKeyCode];
        var numberOfColumns = Number(questionJSON.List.Column_Count) + 1;
        var listObject = questionJSON.List;
        var responses = questionJSON.Responses;
        var columnTitleArray = [];
        var columnItemsArray = [];

        // to retrieve column titles
        for (var columnTitleArrayIndex = 1; columnTitleArrayIndex < numberOfColumns; columnTitleArrayIndex++) {
            var responseKey = "L" + columnTitleArrayIndex + "_1";
            var columnTitle = responses[responseKey].value.Name;
            var tempColumnTitleObject = {};

            tempColumnTitleObject["name"] = "L" + columnTitleArrayIndex;
            tempColumnTitleObject["value"] = columnTitle;
            columnTitleArray.push(tempColumnTitleObject);
        }

        // to retrieve column items
        for (var columnTitleArrayIndex = 1; columnTitleArrayIndex < numberOfColumns; columnTitleArrayIndex++) {
            var listObjectKey = "L" + columnTitleArrayIndex;
            var numberOfItemsInColumn = Number(listObject[listObjectKey]) + 1;
            var tempColumnItem = {};
            var tempColumnItemArray = [];

            tempColumnItem["role"] = listObjectKey;

            for (var itemIndex = 1; itemIndex < numberOfItemsInColumn; itemIndex++) {
                var responseKey = listObjectKey + "_" + itemIndex;
                tempColumnItemArray.push(responses[responseKey].value.value);
            }

            tempColumnItem["items"] = tempColumnItemArray;
            columnItemsArray.push(tempColumnItem);
        }

        $scope.columnItems = columnItemsArray;
        $scope.columnTitles = columnTitleArray;

        $(".simple-question-container-web").removeClass("show").addClass("hide");
        $(".list-question-container-web").removeClass("hide").addClass("show");
    }



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



    // function to handle adding responses [press button]
    $scope.generateResponses = function () {
        var noOfResponse = $("#noOfResponse>input").val();
        $scope.questionButton = false;
        var arrInputIndex = [];
        var label = 1;

        for (var index = 0; index < noOfResponse; index++) {
            var newRow = '<div class="form-group dynamic-responses" id="response-id-' + index + '"><label for="inputPassword3" class="col-sm-2 control-label"></label><div class="col-sm-9" style="padding:0px"><div class="col-md-4"><textarea for="input-label" class="form-control"></textarea></div><div class="col-md-4 add_text_btn_container"><button id="one" class="btn btn-default add_response_button form-control" style="display:none">Add Text</button></div><div class="col-md-4 response-value-container" style="display:none"><textarea for="input-value" class="form-control" style="margin-left:0px;"></textarea></div></div></div>';

            // Add the new dynamic row after the last row
            $('#response-container').append(newRow);
        } // end of for loop

        if ($scope.text_type_checkbox) {
            $("#response-container .add_response_button").show();
        }
    }; // end of generateResponses 



    // event for showing response value inputbox on click event of add_text button
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
                JDPAFactory.postEditedQuestion({
                        "Survey Name": surveyNameFromSelect,
                        "For": "WEB",
                        "Data": QuestionObject
                    },
                    function (data, status) {
                        $scope.message = "inserted!";

                        if (status == "201") {
                            $('#save-alert').removeClass()
                                .addClass("alert alert-success");
                            $timeout(function () {
                                $location.path('/question');
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
            $scope.QuestionNumber++;
            getInputValue();
        } else {
            alert("Check your input!");
        }
    }; // end of nextQuestion



    // function to handle empty input
    function validateForEmptyInput() {
            var question_textarea = $("#question-textarea").val(); // question textarea should not empty
            var no_of_response_input = $("#no-of-response-input").val(); // to check no. of response for 0 or negetive value
            var response_container_length = $("#response-container").children().length; // to find no. of elements in response-container

            if (question_textarea != "") {
                flag = true;
            } else {
                flag = false;
            }
            return flag;
        } // end of validateForEmptyInput



    // common utility function to get values from input box and create question JSON Object
    function getInputValue() {
            var OneQuestionObjectPerQuestion = {};
            var ResponsesPerQuestionObject = {};
            var responseKeyObject = {};
            var responseObject = {};
            var responseIndex = 1;
            QuestionObject = {};

            $("#response-container .form-group").each(function (index, element) {
                var responseValueObject = {};
                var input_label = $(this).find("textarea[for='input-label']").val();
                var input_value = $(this).find("textarea[for='input-value']").val();

                responseValueObject["value"] = input_label;

                if (input_value != "") {
                    responseValueObject["input"] = "TextBox";
                } else {
                    responseValueObject["input"] = "radio";
                }
                responseKeyObject[responseIndex] = responseValueObject;
                responseIndex++;
            });

            Gobal_QuestionJson["Question"] = $scope.question;
            Gobal_QuestionJson["SelectionType"] = SelectionType;
            Gobal_QuestionJson["Responses"] = responseKeyObject;
            Gobal_QuestionJson["Condition"] = $scope.condition;

            QuestionObject[$scope.questionTitle] = Gobal_QuestionJson;
        } // end of getInputValue



    // function to clear question panel for simple question
    function clearQuestionPanelForSimpleQuestion() {
        $("#response-container").empty();
        $("#question-textarea").val("");
        $("#condition-textarea").val("");
        $("#no-of-response-input").val("");
        $scope.text_type_checkbox = false;

    }


    /**
     *
     * For list question
     *
     **/


    // function to save list question
    $scope.saveQuestionForList = function () {
        getInputValueForList();

        if (Object.keys(QuestionObject).length != 0) {
            JDPAFactory.postListQuestionJSON({
                    "Survey Name": surveyNameFromSelect,
                    "For": "WEB",
                    "Data": QuestionObject
                },
                function (data, status) {
                    $scope.message = "inserted!";

                    if (status == "201") {
                        $('#save-alert').removeClass()
                            .addClass("alert alert-success");
                        $timeout(function () {
                            $location.path('/question');
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
    };


    // function to generate final json to send to db
    function getInputValueForList() {
        var OneQuestionObjectPerQuestion = {};
        var responseKeyObject = {};
        var validationProgValueObject = {};
        var listValueObejct = {};
        var columnCount = $(".table-for-list thead th").length;

        // for L1 L2 ....
        $(".table-for-list thead th").each(function () {
            var rowIndex = 1;
            var listLevel = $(this).find("textarea").attr("name");
            var columnTitle = $(this).find("textarea").val();
            var responseValueObject = {};

            // for each item in column
            $(".table-for-list tbody td[role='" + listLevel + "']").find("textarea").each(function () {
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
            $("td[role='" + columnName + "']").find("textarea").each(function () {
                if ($(this).val() != "") {
                    columnItemCount = columnItemCount + 1;
                }
            });

            listValueObejct[columnName] = columnItemCount;
        });

        listValueObejct["Column_Count"] = columnCount;

        Gobal_QuestionJson["Question"] = $scope.question;
        Gobal_QuestionJson["SelectionType"] = "SimpleList";
        Gobal_QuestionJson["List"] = listValueObejct;
        Gobal_QuestionJson["Responses"] = responseKeyObject;

        QuestionObject[$scope.questionTitle] = Gobal_QuestionJson;

        return QuestionObject;
    }


}]);