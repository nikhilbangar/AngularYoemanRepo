"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("ReadyPendingSurveyForMobileController", ["$scope", "$location", "$log", "$routeParams", "JDPAFactory",
    function ($scope, $location, $log, $routeParams, JDPAFactory) {
        var surveyName = $routeParams.surveyName,
            questionJSONData = {},
            Gobal_QuestionJson = {};
        $scope.name = surveyName;
        $scope.questionTitle = surveyName;
        $scope.message = "Continuing from where you left...";

        $('#save-alert').css("display", "inline-block").fadeOut(10000);

        var tempObj = {
            "SurveyName": surveyName,
            "For": "MOBILE_PARTIAL"
        };

        JDPAFactory.getQuestionJSONToEdit(tempObj,
            function (data, status) {
                questionJSONData = data;
                $log.info("Complete fetched json data: " + JSON.stringify(data));

                JDPAFactory.getSpecificQuestionList(tempObj,
                    function (data, status) {
                        $scope.listOfQuestionKeys = data.reverse();
                        $scope.questionKeyCode = $scope.listOfQuestionKeys[0];
                        $scope.totalNumberOfQuestions = Object.keys(data).length;
                        $scope.getQuestionJSONToEdit($scope.questionKeyCode);

                    },
                    function (err) {

                    }
                );
            },
            function (err) {

            }
        );



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
                var inputElement = '<div class="form-group"><label for="inputEmail3" class="col-lg-2 col-sm-3 control-label"></label><div class="row-lbl-container col-sm-9" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" value="' + key + '" style=""></div><div class="col-sm-7"><div class="input-group"><textarea for="input-value-for-osat-grid" class="form-control" placeholder="Row Label">' + value.value + '</textarea><span class=" input-group-addon remove-row-for-osat-grid"><span class="glyphicon glyphicon-remove hide" aria-hidden="true"></span></span></div></div></div></div>';

                $('#response-container').append(inputElement);
            });

        }



        // function for showing StandardAttributeGrid responses
        function showResponseForStandardAttributeGrid(questionJSON) {
            var row = questionJSON.Responses.row,
                exclude = questionJSON.Responses.Exclude;

            angular.forEach(row, function (value, key) {
                $.each(exclude, function (index, myValue) {
                    if (index === key) {
                        var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="row-lbl-container col-sm-9" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style="" value="' + key + '"></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label">' + value.value + '</textarea><span class="btn input-group-addon remove-row-for-osat-grid hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-sm-4"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="exclude"></span><label class="form-control" aria-describedby="basic-addon2">Include N/A</label></div></div></div></div>';
                    } else {
                        var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="row-lbl-container col-sm-9" style="margin-bottom:5px;float:left;"><div class="col-sm-3"><input type="text" class="form-control response-code" placeholder="Code" style="" value="' + key + '"></div><div class="col-sm-5"><div class="input-group"><textarea for="input-value-for-single-grid-radio-or-checkbox" class="form-control" placeholder="Row Label">' + value.value + '</textarea><span class="btn input-group-addon remove-row-for-osat-grid hide"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div><div class="col-sm-4"><div class="input-group"><span class="input-group-addon"><input type="checkbox" class="exclude" checked></span><label class="form-control" aria-describedby="basic-addon2">Include N/A</label></div></div></div></div>';
                    }

                    $('#response-container').append(inputElement);
                });

            });
        }



        // function for showing SimpleRadioOrCheckbox responses
        function showResponseForSimpleRadioOrCheckbox(questionJSON) {
            var responses = questionJSON.Responses;

            angular.forEach(responses, function (value, key) {
                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" value="' + key + '" class="form-control response-code" placeholder="Code"></div><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-radio-or-checkbox" class="form-control" placeholder="Response value">' + value.value + '</textarea><span class=" input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove hide" aria-hidden="true"></span></span></div><div class="response-level-ask-container hide"><div class="input-group" style="margin-bottom:5px"><span class="input-group-addon">ASK</span><input type="text" class="form-control response-ask" aria-describedby="basic-addon2" value="';

                var lowerElement = '"><span class=" input-group-addon remove-ask-at-response-level"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span></div></div></div></div>';

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

                var inputElement = '<div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-7"><div class="input-group" style="margin-left:0px;"><textarea for="input-value-for-simple-dropdown" class="form-control" placeholder="Dropdown Response Value">' + value.value + '</textarea><span class=" input-group-addon remove-sinple-dropdown-item-btn"><span class="glyphicon glyphicon-remove hide" aria-hidden="true"></span></span></div></div></div>';

                $('#response-container').append(inputElement);
            });

        }



        // function for showing showResponseForSimpleMixed responses
        function showResponseForSimpleMixed(questionJSON) {
            var responses = questionJSON.Responses;

            angular.forEach(responses, function (value, key) {
                var inputElement = ' <div class="form-group dynamic-responses"><label for="inputPassword3" class="col-lg-2 col-sm-3 control-label"></label><div class="col-sm-2"><input type="text" class="form-control response-code" placeholder="Code" value="' + key + '"></div><div class="col-sm-5"><div class="input-group" style="margin-left:0px;">';

                var stringAppend = "";

                var lowerInput = '<span class=" input-group-addon btn-delete-at-level1"><span class="glyphicon glyphicon-remove  hide" aria-hidden="true"></span></span></div></div></div>';

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


        $scope.continueToCreateQuestion = function () {
            $location.url("/question/Mobile/" + surveyName);
        }
    }]);