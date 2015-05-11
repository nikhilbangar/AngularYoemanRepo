"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("EditQuestionMobileController", ["$scope", "$log", "$http", "JDPAFactory", function ($scope, $log, $http, JDPAFactory) {
    var QuestionObject = {};
    var surveyNameFromSelect = "";
    var questionJSONData = "";
    var flag = false;
    var questionTitle = null;
    var SelectionType = "SimpleRadioOrCheckbox";
    var Global_SelectionType = "";
    var Gobal_QuestionJson = {};
    $scope.questionTitle = "Question Number";
    $scope.name = "Survey name";
    $scope.condition = "";
    $scope.totalNumberOfQuestions = "";



    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForMobile(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {

        }
    ); // end of getSurveyNames



    // function to handle surveyname selection box
    $scope.changeSurveyNameSelect = function (surveyName) {
        surveyNameFromSelect = surveyName;
        if (surveyName) {
            // function to handle fetching survey names from db
            var tempObj = {
                "SurveyName": surveyName,
                "For": "MOBILE"
            };

            JDPAFactory.getQuestionJSONToEdit(tempObj,
                function (data, status) {
                    questionJSONData = data;

                    JDPAFactory.getSpecificQuestionList(tempObj,
                        function (data, status) {
                            $scope.listOfQuestionKeys = data;
                            $scope.totalNumberOfQuestions = Object.keys(data).length;
                        },
                        function (err) {

                        }
                    );


                },
                function (err) {

                }
            );
        }
    };



    // function for showing question select box
    $scope.getQuestionJSONToEdit = function (questionNumber) {
        $scope.text_type_checkbox = false;
        $scope.questionNumber = questionNumber;
        var totalNumberOfQuestion = Object.keys(questionJSONData).length;
        $scope.questionTitle = $scope.questionKeyCode;
        var questionJSON = questionJSONData[questionNumber];
        $scope.questionJSON = questionJSONData[questionNumber];
        Gobal_QuestionJson = questionJSONData[questionNumber];
        var selectionType = questionJSON.SelectionType;
        $scope.question = questionJSON.Question;
        $('#response-container').empty();

        switch (selectionType) {
        case "SimpleRadioOrCheckbox":
            showResponseForSimpleRadioOrCheckbox(questionJSON);
            break;
        case "SimpleMixed":
            showResponseForSimpleMixed(questionJSON);
            break;
        case "SimpleDropDown":
            showResponseForSimpleDropDown(questionJSON);
            break;
        case "MultiDropDown":
            showResponseForMultiDropDown(questionJSON);
            break;
        case "LoyaltyGrid":
            break;
        case "StandardAttributeGrid":
            showResponseForStandardAttributeGrid(questionJSON);
            break;
        case "OSATGrid":
            showResponseForOSATGrid(questionJSON);
        }
    };



    // function for showing OSATGrid responses
    function showResponseForOSATGrid(questionJSON) {
        var row = questionJSON.Responses.row;

        angular.forEach(row, function (value, key) {
            var inputElement = '<div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="row-lbl-container col-sm-9" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" value="' + key + '" style=""></div><div class="col-sm-7"><div class="input-group"><textarea for="input-value-for-osat-grid" class="form-control" placeholder="Row Label">' + value.value + '</textarea><span class="btn input-group-addon remove-row-for-osat-grid hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div></div>';

            $('#response-container').append(inputElement);
        });

    }


    // function for showing StandardAttributeGrid responses
    function showResponseForStandardAttributeGrid(questionJSON) {
        var row = questionJSON.Responses.row,
            exclude = questionJSON.Responses.Exclude,
            isExclude = Object.keys(exclude).length;

        if (isExclude) {
            angular.forEach(row, function (value, key) {
                ifExludeIsThere(exclude, key, value);
            });
        } else {
            angular.forEach(row, function (value, key) {
                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="row-lbl-container col-sm-9" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style="" value="' + key + '"></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label">' + value.value + '</textarea><span class="btn input-group-addon remove-row-for-osat-grid hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-sm-4"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="exclude" checked></span><label class="form-control" aria-describedby="basic-addon2">Include N/A</label></div></div></div></div>';

                $('#response-container').append(inputElement);
            });
        }
    }


    
    function ifExludeIsThere(exclude, key, value) {
        $.each(exclude, function (index, myValue) {
            if (index === key) {
                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="row-lbl-container col-sm-9" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style="" value="' + key + '"></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label">' + value.value + '</textarea><span class="btn input-group-addon remove-row-for-osat-grid hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-sm-4"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="exclude"></span><label class="form-control" aria-describedby="basic-addon2">Include N/A</label></div></div></div></div>';
            } else {
                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="row-lbl-container col-sm-9" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style="" value="' + key + '"></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label">' + value.value + '</textarea><span class="btn input-group-addon remove-row-for-osat-grid hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-sm-4"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="exclude" checked></span><label class="form-control" aria-describedby="basic-addon2">Include N/A</label></div></div></div></div>';
            }

            $('#response-container').append(inputElement);
        });
    }



    // function for showing SimpleRadioOrCheckbox responses
    function showResponseForSimpleRadioOrCheckbox(questionJSON) {
        var responses = questionJSON.Responses;

        angular.forEach(responses, function (value, key) {
            var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" value="' + key + '" class="form-control response-code" placeholder="Code"></div><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-radio-or-checkbox" class="form-control" placeholder="Response value">' + value.value + '</textarea><span class="btn input-group-addon btn-delete-at-level1 hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div><div class="response-level-ask-container hide"><div class="input-group" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input type="text" class="form-control response-ask" aria-describedby="basic-addon2" value="';

            var lowerElement = '"><span class="btn input-group-addon remove-ask-at-response-level"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div></div>';

            var stringAppend = "",
                finalElement = "";

            if (value.PROG_Ask) {
                stringAppend = value.PROG_Ask;
                finalElement = inputElement + stringAppend + lowerElement;

            } else {
                stringAppend = "";
                finalElement = inputElement + stringAppend + lowerElement;
            }

            $('#response-container').append(finalElement);
        });
    }


    // function for showing MultiDropDown responses
    function showResponseForMultiDropDown(questionJSON) {
        var noOfDropDowns = questionJSON.Column_Count;
        var responses = questionJSON.Responses;

        var upperElement = ' <div class="multidropdown-container"><div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-9" style=""><table class="table table-striped table-for-multidropdown"><thead><tr><th> Dropdown Label </th><th> Dropdown Item </th></tr></thead><tbody>';
        var lowerElement = '</tbody></table></div></div></div>';
        var stringAppend = "";

        angular.forEach(responses, function (value, key) {
            var inputElement = '<tr><td><textarea placeholder="Dropdown Label" name="' + key + '" class="form-control">' + value.value.Name + '</textarea></td><td> <textarea placeholder="Dropdown Label" class="form-control">' + value.value.value + '</textarea></td></tr>';

            stringAppend = stringAppend + inputElement;
        });

        stringAppend = upperElement + stringAppend + lowerElement;

        $('#response-container').append(stringAppend);
    }


    // function for showing SimpleDropDown responses
    function showResponseForSimpleDropDown(questionJSON) {
        var responses = questionJSON.Responses;

        angular.forEach(responses, function (value, key) {

            var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-dropdown" class="form-control" placeholder="Dropdown Response Value">' + value.value + '</textarea><span class="btn input-group-addon remove-sinple-dropdown-item-btn hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';

            $('#response-container').append(inputElement);
        });

    }


    // function for showing showResponseForSimpleMixed responses
    function showResponseForSimpleMixed(questionJSON) {
        var responses = questionJSON.Responses;

        angular.forEach(responses, function (value, key) {
            var inputElement = ' <div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code" value="' + key + '"></div><div class="col-sm-5"><div class="input-group" style="margin-left:0px;">';

            var stringAppend = "";

            var lowerInput = '<span class="btn input-group-addon btn-delete-at-level1 hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div>';

            if (value.input == "text") {
                stringAppend = '<textarea class="form-control for-textbox" role="' + value.input + '" placeholder="Input Text">' + value.value + '</textarea>';
            } else
            if (value.input == "checkbox") {
                stringAppend = '<textarea class="form-control for-checkbox-or-radio" role="' + value.input + '" placeholder="Input Text">' + value.value + '</textarea>';
            } else
            if (value.input == "textarea") {
                stringAppend = '<textarea class="form-control for-textbox" role="' + value.input + '" placeholder="Input Text">' + value.value + '</textarea>';
            }

            stringAppend = inputElement + stringAppend + lowerInput;

            $('#response-container').append(stringAppend);

        });

    }



    // function for handling question generation
    $scope.saveQuestion = function () {
        getInputValue();

        var tempObjToPost = {
            "Survey Name": surveyNameFromSelect,
            "For": "MOBILE",
            "Data": QuestionObject
        };

        $log.info("Data to post: " + JSON.stringify(tempObjToPost));

        if (Object.keys(QuestionObject).length != 0) {
            JDPAFactory.postEditedQuestion(tempObjToPost,
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
            var question_textarea = $("#question").val(); // question textarea should not empty
            var response_input_label_flag = true; // flag to check response input label not to be blank
            var response_container_length = $("#response-container").children().length; // to find no. of elements in response-container

            // event to handle response input to check is not empty
            $("#response-container .form-group").each(function (index, element) {
                var input_label = $(this).find("textarea[for='input-label']").val();
                if (input_label == "") {
                    response_input_label_flag = false;
                }
            }); // end of #response-container .form-group

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

            var responseValueObject = {};

            switch ($scope.questionJSON.SelectionType) {
            case "SimpleRadioOrCheckbox":
                responseValueObject = getResponseForSimpleRadioOrCheckbox($("#response-container"));
                break;
            case "SimpleMixed":
                responseValueObject = getResponseForSimpleMixed($("#response-container"));
                break;
            case "SingleGridRadioOrCheckbox":
                responseValueObject = getResponseForSingleGridRadioOrCheckbox($("#response-container"));
                break;
            case "SimpleDropDown":
                responseValueObject = getResponseForSimpleDropdown($("#response-container"));
                break;
            case "MultiDropDown":
                OneQuestionObjectPerQuestion["List"] = getListValueObejct($("#response-container"));
                responseValueObject = getResponseForMultiDropdown($("#response-container"));
                break;
            case "LoyaltyGrid":
                responseValueObject = getResponseForLoyaltyGrid($("#response-container"));
                break;
            case "OSATGrid":
                responseValueObject = getOSATGrid($("#response-container"));
                break;
            case "StandardAttributeGrid":
                responseValueObject = getStandardAttributeGrid($("#response-container"));
                break;
            }

            Gobal_QuestionJson["Question"] = $scope.question;
            Gobal_QuestionJson["Responses"] = responseValueObject;
            QuestionObject[$scope.questionNumber] = Gobal_QuestionJson;

        } // end of getInputValue



    // function to get List for MultiDropdown
    function getListValueObejct(parentContainer) {
        var listValueObejct = {};
        var table_for_multidropdown = parentContainer.find(".table-for-multidropdown"),
            columnCount = table_for_multidropdown.find("thead th").length;;

        // event to create listValueObject object
        table_for_multidropdown.find("tbody td").each(function () {
            var columnName = $(this).attr("role");
            var columnItemCount = 0;

            $("td[role='" + columnName + "']").find("textarea").each(function () {
                if ($(this).val() != "") {
                    columnItemCount = columnItemCount + 1;
                }
            });

            listValueObejct[columnName] = columnItemCount.toString();
        });

        listValueObejct["Column_Count"] = columnCount.toString();

        return listValueObejct;
    }



    // get response json for SingleGridRadioOrCheckbox
    function getResponseForSingleGridRadioOrCheckbox(parentContainer) {
        var parentContainer = $("#response-container");
        var responseValueObject = {},
            rowKeyObject = {},
            columnKeyObject = {};


        var table_for_single_grid = parentContainer.find(".table-for-singlegrid"),
            no_of_rows = table_for_single_grid.find('.row-lbl-container'),
            no_of_columns = table_for_single_grid.find('.column-lbl-container'),
            rowKeyIndex = 1,
            columnKeyIndex = 1;

        no_of_rows.each(function () {
            var rowValueObject = {};

            var current_row = $(this),
                response_code = current_row.find(".response-code").val(),
                response = current_row.find("textarea[for='input-value-for-single-grid-radio-or-checkbox']").val();


            rowValueObject["value"] = response;

            if (response_code != "") {
                rowKeyObject[response_code] = rowValueObject;
            } else {
                rowKeyObject[rowKeyIndex] = rowValueObject;
            }

            rowKeyIndex++;
        });

        no_of_columns.each(function () {
            var columnValueObject = {};

            var current_column = $(this),
                columnItem = current_column.find("input").val();


            columnValueObject["value"] = columnItem;
            columnValueObject["input"] = "radio";
            columnKeyObject[columnKeyIndex] = columnValueObject;

            columnKeyIndex++;
        });

        responseValueObject["row"] = rowKeyObject;
        responseValueObject["col"] = columnKeyObject;

        return responseValueObject;
    }



    // get response json for OSATGrid
    function getOSATGrid(parentContainer) {
        var responseValueObject = {},
            rowKeyObject = {},
            columnKeyObject = {};

        var table_for_osat_grid = parentContainer.find(".table-for-osatgrid"),
            no_of_rows = $("#response-container .form-group"),
            no_of_columns = table_for_osat_grid.find('.column-lbl-container'),
            rowKeyIndex = 1;

        no_of_rows.each(function () {
            var rowValueObject = {};

            var current_row = $(this),
                response_code = current_row.find(".response-code").val(),
                response = current_row.find("textarea[for='input-value-for-osat-grid']").val();


            rowValueObject["value"] = response;

            if (response_code != "") {
                rowKeyObject[response_code] = rowValueObject;
            } else {
                rowKeyObject[rowKeyIndex] = rowValueObject;
            }

            rowKeyIndex++;
        });

        columnKeyObject = {
            "1": {
                "value": "1",
                "input": "radio"
            },
            "2": {
                "value": "2",
                "input": "radio"
            },
            "3": {
                "value": "3",
                "input": "radio"
            },
            "4": {
                "value": "4",
                "input": "radio"
            },
            "5": {
                "value": "5",
                "input": "radio"
            },
            "6": {
                "value": "6",
                "input": "radio"
            },
            "7": {
                "value": "7",
                "input": "radio"
            },
            "8": {
                "value": "8",
                "input": "radio"
            },
            "9": {
                "value": "9",
                "input": "radio"
            },
            "10": {
                "value": "10",
                "input": "radio"
            }
        };

        responseValueObject["row"] = rowKeyObject;
        responseValueObject["col"] = columnKeyObject;

        return responseValueObject;
    }



    // get response json for StandardAttributeGrid
    function getStandardAttributeGrid(parentContainer) {
        var responseValueObject = {},
            excludedObject = {},
            rowKeyObject = {},
            columnKeyObject = {};

        var table_for_standard_attribute_grid = parentContainer.find(".table-for-standard-attribute-grid"),
            no_of_rows = $("#response-container .form-group"),
            no_of_columns = table_for_standard_attribute_grid.find('.column-lbl-container'),
            rowKeyIndex = 1;

        no_of_rows.each(function () {
            var rowValueObject = {};

            var current_row = $(this),
                response_code = current_row.find(".response-code").val(),
                response = current_row.find("textarea[for='input-value-for-single-grid-radio-or-checkbox']").val(),
                isExcluded = current_row.find(".exclude").is(":checked");


            rowValueObject["value"] = response;


            if (response_code != "") {
                rowKeyObject[response_code] = rowValueObject;
            } else {
                rowKeyObject[rowKeyIndex] = rowValueObject;
            }


            if (!isExcluded) {

                var sampleObject = {};

                if (response_code != "") {
                    sampleObject[response_code] = "11";
                } else {
                    sampleObject[rowKeyIndex] = "11";
                }
                excludedObject = sampleObject;
            }


            rowKeyIndex++;



        });

        columnKeyObject = {
            "1": {
                "value": "1",
                "input": "radio"
            },
            "2": {
                "value": "2",
                "input": "radio"
            },
            "3": {
                "value": "3",
                "input": "radio"
            },
            "4": {
                "value": "4",
                "input": "radio"
            },
            "5": {
                "value": "5",
                "input": "radio"
            },
            "6": {
                "value": "6",
                "input": "radio"
            },
            "7": {
                "value": "7",
                "input": "radio"
            },
            "8": {
                "value": "8",
                "input": "radio"
            },
            "9": {
                "value": "9",
                "input": "radio"
            },
            "10": {
                "value": "10",
                "input": "radio"
            },
            "11": {
                "value": "N/A",
                "input": "radio"
            }
        };

        responseValueObject["row"] = rowKeyObject;
        responseValueObject["col"] = columnKeyObject;
        responseValueObject["Exclude"] = excludedObject;

        return responseValueObject;
    }


    var rowKeyIndex = 1;
    // get response json for SimpleRadioOrCheckbox
    function getResponseForSimpleRadioOrCheckbox(parentContainer) {
        var rowKeyObject = {};
        var response_container = $("#response-container .form-group");

        rowKeyIndex = 1;

        response_container.each(function () {
            var rowValueObject = {};

            var current_container = $(this),
                response_code = current_container.find(".response-code").val(),
                response = current_container.find("textarea[for='input-value-for-simple-radio-or-checkbox']").val(),
                response_ask = current_container.find(".response-ask").val();

            rowValueObject["value"] = response;
            rowValueObject["input"] = "radio";

            if (response_code != "") {
                if (response_ask != "")
                    rowValueObject["PROG_Ask"] = response_ask;

                rowKeyObject[response_code] = rowValueObject;
            } else {
                if (response_ask != "")
                    rowValueObject["PROG_Ask"] = response_ask;

                rowKeyObject[rowKeyIndex] = rowValueObject;
            }

            rowKeyIndex++;
        });

        return rowKeyObject;
    }



    // get response json for LoyaltyGrid
    function getResponseForLoyaltyGrid(parentContainer) {
        var responseValueObject = {};

        responseValueObject = {
            "1": {
                "value": "Definitely will not",
                "input": "radio"
            },
            "2": {
                "value": "Probably will not",
                "input": "radio"
            },
            "3": {
                "value": "Probably will",
                "input": "radio"
            },
            "4": {
                "value": "Definitely will",
                "input": "radio"
            },
            "5": {
                "value": "Don't know",
                "input": "radio"
            }
        }

        return responseValueObject;
    }



    // get response json for SimpleDropdown
    function getResponseForSimpleDropdown(parentContainer) {
        var rowKeyObject = {};
        var response_container = $("#response-container .form-group"),
            rowKeyIndex = 1;

        response_container.each(function () {
            var rowValueObject = {};

            var current_container = $(this),
                response = current_container.find("textarea[for='input-value-for-simple-dropdown']").val();

            rowValueObject["value"] = response;
            rowValueObject["input"] = "radio";

            rowKeyObject[rowKeyIndex] = rowValueObject;

            rowKeyIndex++;
        });

        return rowKeyObject;
    }



    // get response json for MultiDropdown
    function getResponseForMultiDropdown(parentContainer) {
        var responseKeyObject = {};

        var table_for_multidropdown = parentContainer.find(".table-for-multidropdown");

        // for L1 L2 ....
        table_for_multidropdown.find("thead th").each(function () {
            var responseValueObject = {};

            table_for_multidropdown.find("tbody tr").each(function () {
                var singleColumnItemValueObject = {};
                var currentRow = $(this);
                var key = currentRow.find("textarea:first").attr("name");
                var columnTitle = currentRow.find("textarea:first").val();
                var columnItem = currentRow.find("textarea:last").val();

                responseValueObject = {};

                singleColumnItemValueObject["Name"] = columnTitle;
                singleColumnItemValueObject["value"] = columnItem;

                responseValueObject["value"] = singleColumnItemValueObject;
                responseValueObject["input"] = "radio";

                responseKeyObject[key] = responseValueObject;
            });
        });

        return responseKeyObject;
    }



    // get response json for SimpleMixed
    function getResponseForSimpleMixed(parentContainer) {
        var rowKeyObject = {};
        var question = $("textarea#question").val();
        var response_container = $("#response-container .form-group");
        rowKeyIndex = 1;

        response_container.each(function () {
            var rowValueObject = {};

            var current_container = $(this),
                response_code = current_container.find(".response-code").val();

            if (current_container.find(".for-textbox").length) {
                var input_text = current_container.find(".for-textbox").val(),
                    value = question,
                    input = current_container.find(".for-textbox").attr("role");

                rowValueObject["value"] = value;
                rowValueObject["input"] = input;
                rowValueObject["input_text"] = input_text;
            } else {
                var value = current_container.find(".for-checkbox-or-radio").val();

                rowValueObject["value"] = value;
                rowValueObject["input"] = "checkbox";
            }

            if (response_code != "") {
                rowKeyObject[response_code] = rowValueObject;
            } else {
                rowKeyObject[rowKeyIndex] = rowValueObject;
            }

            rowKeyIndex++;
        });

        return rowKeyObject;
    }



    // function to clear the question panel
    function clearQuestionPanel() {
        $("#response-container").empty();
        $("#question").val("");
        $("#no-of-response-input").val("");
        $scope.text_type_checkbox = false;
        SelectionType = "SimpleRadioOrCheckbox";
    }


}]);