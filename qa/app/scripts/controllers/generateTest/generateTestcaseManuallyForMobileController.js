"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("GenerateTestcaseManuallyForMobileController", ["$scope", "$log", "$location", "$routeParams", "JDPAFactory",
    function ($scope, $log, $location, $routeParams, JDPAFactory) {
        var tempObject = {},
            tempObjectForMultiDropDown = {};
        $scope.testcaseName = $routeParams.testcaseName;
        $scope.globalStringArr = [];
        $scope.globalString = "";

        
        
        // function to handle fetch survey names from db
        JDPAFactory.getSurveyNamesForMobile(
            function (data, status) {
                $scope.surveyNames = data;
            },
            function (err) {

            }
        ); // end of getSurveyNames



        // event to generate dynamic question row in testcase panel
        $(".table-for-testcases tbody").on("keydown", "tr:last-child textarea:first", function (event) {
            if (event.which == 9) {

                var addInput = '<tr><td><textarea class="form-control" role="question-label"></textarea></td><td><textarea class="form-control" style="margin-bottom:5px;" role="response-value"></textarea></td><td><textarea class="form-control" style="margin-bottom:5px;" role="next-question-label"></textarea></td></tr>';

                $(this).parent("td").parent("tr").after(addInput);
            }
        });



        // event to generate dynamic response textarea in testcase panel
        $(".table-for-testcases tbody").on("keydown", "td:nth-child(2) textarea", function (event) {
            if (event.which == 9) {
                var addInput = '<textarea class="form-control" style="margin-bottom:5px;" role="response-value"></textarea>';
                $(this).parent("td").find("textarea:last-child").after(addInput);
            }
        });



        // function saving edited data back to db in JSON form;
        $scope.saveTestcase = function () {
            var questionObject = {};

            questionObject["Survey Name"] = $scope.surveyName;
            questionObject["Testcase Name"] = $scope.testcaseName;
            questionObject["For"] = "MOBILE";
            questionObject["Data"] = $scope.globalStringArr;
           
            JDPAFactory.saveManualTraversalPath(questionObject,
                function (data, status) {
                    $scope.message = data;
                    if (status == "201") {
                        $('#save-alert').removeClass()
                            .addClass("alert alert-success");
                        $timeout(function () {}, 4000);
                    } else {
                        $('#save-alert').removeClass("alert-danger")
                            .addClass("alert alert-success");
                    }
                    $('#save-alert').css("display", "block").fadeOut(4000);
                },
                function (err) {
                    $scope.message = "Network Error!";
                    $('#save-alert').css("display", "block").fadeOut(4000);
                });

        }; // end of saveEditedTestcase



        $scope.promptASK = function (questionCode, obj, askQuestion, selectionType) {
            switch (selectionType) {
            case "StandardAttributeGrid":
                var response = getStandardAttributeGridResponse(questionCode, obj);
                $scope.globalString = getStandardAttributeGridResponseString(questionCode, response);
                break;
            case "OSATGrid":
                var response = getOsatResponse(questionCode, obj);
                $scope.globalString = getStandardAttributeGridResponseString(questionCode, response);
                break;
            case "MultiDropDown":
                var response = getMultiDropDownResponse(questionCode, obj),
                    dropdownItemsArr = getItemArrForMultiDropDown(response);
                $scope.globalString = generateStringForMultiDropDown(questionCode, dropdownItemsArr);
                break;
            default:
                var string = getStringForDefault(questionCode, obj);
                $scope.globalString = string;
            }
        }

        
        
        var tempObjectForSAG = {},
            tempObjectForOSAT = {};

        
        
        function getOsatResponse(questionCode, obj) {
            var tempKey = obj.target.attributes.name.value;
            var tempValue = obj.target.attributes.value.value;

            tempObjectForOSAT[tempKey] = tempValue;

            return tempObjectForOSAT;
        }

        
        
        function getStandardAttributeGridResponse(questionCode, obj) {
            var tempKey = obj.target.attributes.name.value;
            var tempValue = obj.target.attributes.value.value;

            tempObjectForSAG[tempKey] = tempValue;

            return tempObjectForSAG;
        }

        
        
        function getStandardAttributeGridResponseString(questionCode, response) {
            var stringAppend = "",
                responseIndex = 0,
                noOfResponses = Object.keys(response).length;

            $.each(response, function (index, element) {
                var tempString = getStringForSAG(index, element);

                stringAppend = stringAppend + tempString;

                if (noOfResponses - 1 > responseIndex) {
                    stringAppend = stringAppend + "_,_";
                }

                responseIndex++;
            });

            stringAppend = questionCode + ":{" + stringAppend + "}";

            return stringAppend;
        }

        
        
        function getStringForSAG(key, value) {
            var tempVar = "";
            tempVar = key + "_[" + value + "]";
            return tempVar;
        }

        
        
        function getStringForDefault(questionCode, obj) {
            var response = obj.target.attributes.value.value,
                stringAppend = "";

            stringAppend = questionCode + colonSeperator + response;

            return stringAppend;
        }


        
        function getMultiDropDownResponse(questionCode, obj) {
            var tempKey = obj.target.attributes.name.value,
                tempValue = obj.target.attributes.value.value;

            tempObjectForMultiDropDown[tempKey] = tempValue;

            return tempObjectForMultiDropDown;
        }

        

        function getItemArrForMultiDropDown(Obj) {
            var tempArr = [];

            angular.forEach(Obj, function (value, key) {
                tempArr.push(value);
            });

            return tempArr;
        }



        var commaSeperator = ",",
            colonSeperator = ":",
            leftSquarBracket = "[",
            rightSquarBracket = "]",
            underscore = "_",
            leftCurlyBraces = "{",
            rightCurlyBraces = "}";


        
        function generateStringForMultiDropDown(questionCode, response) {
            var noOfResponses = response.length,
                stringAppend = "";

            for (var responseIndex = 0; responseIndex < noOfResponses; responseIndex++) {
                stringAppend = stringAppend + response[responseIndex];
                if (noOfResponses - 1 > responseIndex) {
                    stringAppend = stringAppend + ",";
                }
            }

            stringAppend = questionCode + colonSeperator + leftSquarBracket + stringAppend + rightSquarBracket;

            return stringAppend;
        }

       
        
        var questionLength = "",
            questionData = {},
            code = {},
            group = [],
            questionArr = [];


        
        $("select[name='selectSurvey']").change(function () {
            if ($(this).val() != "Select Survey") {
                $(".question-panel-container").removeClass("hide").addClass("show");
                $scope.surveyName = $(this).val();
                
                var tempObject = {"SurveyName":$scope.surveyName,"For":"MOBILE"};

                JDPAFactory.getQuestionsForManualTestcase(
                		tempObject,
                    function (data, status) {
                        questionData = data.Data;
                        questionKeys = Object.keys(data);
                        code = data.Code;
                        group = data.Group;

                        questionLength = Object.keys(code).length;

                        renderQuestionData();
                        disable($(".previous"));
                    },
                    function (error) {
                        $log.debug(error);
                    });
            } else {
                $(".question-panel-container").removeClass("show").addClass("hide");
            }
        });



        var currentIndex = 1;

        
        
        $scope.nextQuestion = function () {
            ++currentIndex;
            tempObjectForSAG = {};
            if (currentIndex <= questionLength) {
                renderQuestionData();
                enable($(".previous"));
            } else {
                renderQuestionData();
                disable($(".next"));
                enable($(".save"));
            }

            generateTestString();
        }

        
        
        function generateTestString() {
            if($scope.globalString != ""){
                $scope.globalStringArr.push($scope.globalString);
            }
            
            $scope.globalString = "";
        }

        
        
        $scope.previousQuestion = function () {
            --currentIndex;

            if (currentIndex > 1) {
                renderQuestionData();
                enable($(".next"));
            } else {
                renderQuestionData();
                disable($(".previous"));
            }
        }

        
        
        var groupedQuestions = [];

        
        
        function renderQuestionData() {
            groupedQuestions = [];

            if (code[currentIndex]) {} else {
                return;
            }

            var questionKey = code[currentIndex],
                selectionType = questionData[questionKey].SelectionType,
                responses = [];


            switch (selectionType) {
            case "StandardAttributeGrid":
                responses = formatResponsesForStandardAttributeGrid(questionData[questionKey]);
                break;
            case "OSATGrid":
                responses = formatResponsesForOSAT(questionData[questionKey]);
                break;
            case "MultiDropDown":
                responses = formatResponsesForMultiDropDown(questionData[questionKey]);
                break;
            default:
                responses = formatResponses(questionData[questionKey].Responses);

            }

            groupedQuestions.push({
                questionCode: questionKey,
                questionText: questionData[questionKey].Question,
                selectionType: selectionType,
                responses: responses,
                progAsk: questionData[questionKey].PROG_Ask
            });

            $scope.groupQuestions = groupedQuestions;
        }

        
        
        function formatResponsesForStandardAttributeGrid(questionData) {
            var include = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "N/A"],
                exclude = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            var excludeArr = Object.keys(questionData.Responses.Exclude),
                row = questionData.Responses.row,
                tempArr = [],
                responseObject = {},
                responseArr = [];

            angular.forEach(row, function (value, key) {
                var tempObject = {};

                tempObject["code"] = key;
                tempObject["value"] = value;

                if ($.inArray(key, excludeArr) > -1) {
                    tempObject["listOfRadio"] = exclude;
                } else {
                    tempObject["listOfRadio"] = include;
                }

                tempArr.push(tempObject);
            });

            responseObject["col"] = include;
            responseObject["data"] = tempArr;

            responseArr.push(responseObject);

            return responseArr;
        }

        
        
        function formatResponsesForOSAT(questionData) {
            var response = questionData.Responses,
                rowKeyObject = questionData.Responses.row,
                colArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                responseArr = [];

            angular.forEach(rowKeyObject, function (value, key) {
                var tempObject = {};
                tempObject["code"] = key;
                tempObject["value"] = value.value;
                tempObject["col"] = colArray;
                responseArr.push(tempObject);
            });

            return responseArr;
        }



        function formatResponsesForMultiDropDown(questionData) {
            var questionJSON = questionData;
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
                    var tempObject = {};
                    tempObject['role'] = responseKey;
                    tempObject['item'] = responses[responseKey].value.value;

                    tempColumnItemArray.push(tempObject);
                }

                tempColumnItem["items"] = tempColumnItemArray;
                columnItemsArray.push(tempColumnItem);
            }

            var numberOfDropdowns = columnTitleArray.length;
            var dropdownArr = [];

            for (var dropdownIndex = 0; dropdownIndex < numberOfDropdowns; dropdownIndex++) {
                var dropdownObject = {};
                var item = columnItemsArray[dropdownIndex].items;
                var role = columnItemsArray[dropdownIndex].role;
                var title = columnTitleArray[dropdownIndex].value;
                dropdownObject["title"] = title;
                dropdownObject["role"] = role;
                dropdownObject["items"] = item;
                dropdownArr.push(dropdownObject);
            }

            return dropdownArr;
        }



        function formatResponses(testcaseResponses) {
            var tempResponses = testcaseResponses,
                responses = [];

            $.each(tempResponses, function (responseIndex, response) {
                responses.push({
                    valueIndex: responseIndex,
                    value: response.value,
                    inputType: response.input,
                    progAsk: response.PROG_Ask,
                    inputText: response.input_text
                });
            });

            return responses;
        }

        

        function enable(htmlElement) {
            htmlElement.attr("disabled", false);
        }

        
        
        function disable(htmlElement) {
                htmlElement.attr("disabled", true);
            }
            //******* End : Written by SANJAY ********/

    }]);