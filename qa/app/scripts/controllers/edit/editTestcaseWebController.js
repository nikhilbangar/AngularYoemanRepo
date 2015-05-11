"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("EditTestcaseWebController", ["$scope", "$log", "$http", "JDPAFactory", function ($scope, $log, $http, JDPAFactory) {
    var testcaseData = [];
    $scope.testcases = [];
    var surveyName = "";
    var testcaseName = "";



    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForWeb(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {}); // end of getSurveyNamesFromTestcaseCollection



    // event to handle hiding testcase select
    $("div.col-md-2-survey-name-container select").click(function () {
        surveyName = $(this).val();

        if (surveyName != "Survey") {
            $("div.col-md-2-testcase-name-container").removeClass("hide").addClass("show");
            $("div.col-md-8-testcase-edit-container").removeClass("show").addClass("hide");
            $("div.col-md-2-testcase-name-container select").find("option.default").attr("selected", true);
            // function to handle fetch survey names from db
            JDPAFactory.getTestcaseNames({
                    "SurveyName": surveyName,
                    "For": "WEB"
                },
                function (data, status) {
                    $scope.testcaseNames = Object.keys(data);
                },
                function (err) {}); // end of getTestcaseNames
        }
    }); // end div.col-md-2-survey-name-container select


    var Global_testgoal = "";

    // event to handle showing testcase edit details
    $("div.col-md-2-testcase-name-container select").click(function () {
        var questionObjectArray = [];
        $scope.testcases = [];
        testcaseName = $(this).val();
        $scope.tc_name = $(this).val();

        if (testcaseName != "Testcases") {
            $("div.col-md-8-testcase-edit-container").removeClass("hide").addClass("show");

            JDPAFactory.getTestcaseNames({
                    "SurveyName": surveyName,
                    "For": "WEB"
                },
                function (data, status) {
                    var questions = Object.keys(data[testcaseName]);
                    var questionsOrderList = [];
                    Global_testgoal = data[testcaseName].TestGoal;

                    var questionsOrderList = [];

                    for (var questionIndex = 0; questionIndex < questions.length; questionIndex++) {
                        var question = Object.keys(data[testcaseName])[questionIndex];
                        var index = data[testcaseName][question].index;

                        questionsOrderList[index] = question;
                    }

                    for (var questionIndex = 0; questionIndex < questions.length - 1; questionIndex++) {
                        var testcaseObject = {};
                        var question = Object.keys(data[testcaseName])[questionIndex];
                        if (questionsOrderList.length > 0)
                            question = questionsOrderList[questionIndex];

                        var response = data[testcaseName][question].Response;
                        var next = data[testcaseName][question].Next;
                        var Forced = data[testcaseName][question].Forced;
                        var index = data[testcaseName][question].index;

                        testcaseObject["question"] = question;
                        testcaseObject["response"] = response;
                        testcaseObject["next"] = next;
                        testcaseObject["Forced"] = Forced;
                        testcaseObject["index"] = index;
                        questionObjectArray.push(testcaseObject);
                    }

                    $scope.testcases = questionObjectArray;
                },
                function (err) {}); // end of getTestcaseNames

        } else {} // end of if else
    }); // end of div.col-md-2-testcase-name-container

    $scope.isArray = function (response) {
        return angular.isArray(response);
    };



    // function saving edited data back to db in JSON form;
    $scope.saveEditedTestcase = function () {
        var questionKeyObject = {};
        var questionObject = {};

        $(".col-md-8-testcase-edit-container").find("table tbody tr").each(function () {
            var questionValueObject = {};

            var responseArray = [];
            var responseObject = {};
            var nextArray = [];
            var question_label = $(this).find("textarea[role='question-label']").val();
            var role_index = $(this).find("textarea[role='question-label']").attr("role-index");
            var role_forced = $(this).find("textarea[role='question-label']").attr("role-forced");

            if (role_forced === "true") {
                role_forced = true;
            } else {
                role_forced = false;
            }


            $(this).find("textarea[role='response-value']").each(function () {
                responseArray.push($(this).val());
            });

            $(this).find("textarea[role='next-question-label']").each(function () {
                nextArray.push($(this).val());
            });

            var next_question_label = $(this).find("textarea[role='next-question-label']").val();
            var tempObject = {};
            if ($(this).find(".response-object-container").length) {
                $(this).find(".response-object-container").each(function () {
                    var tempArray = [];

                    var objectKey = $(this).find(".response-object-key").val();
                    var objectValue = $(this).find(".response-object-value").val();

                    tempArray.push(objectValue);

                    tempObject[objectKey] = tempArray;

                });

                questionValueObject["Response"] = tempObject;
            } else {
                questionValueObject["Response"] = responseArray;
            }
            questionValueObject["Next"] = nextArray;
            questionValueObject["index"] = role_index;
            questionValueObject["Forced"] = role_forced;

            questionKeyObject[question_label] = questionValueObject;

            questionKeyObject["TestGoal"] = Global_testgoal;
        });

        questionObject["Survey Name"] = surveyName;
        questionObject["For"] = "WEB";
        questionObject["Testcase Name"] = testcaseName;
        questionObject["Data"] = questionKeyObject;

        $log.debug("Data to post: " + JSON.stringify(questionKeyObject));

        JDPAFactory.postEditedTestcase(questionObject,
            function (data, status) {
                $scope.message = data;

                if (status == "201") {
                    $('#save-alert').removeClass("alert-danger")
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


    /*** new features added below 1. delete question from testcase/path 2.add question at end to path/tc */
    // -parshuram : to "delete" the question from testcase object
    $scope.removeQuestion = function (qnObjectIndex) {
            if (confirm("Are you sure you want to delete ...?")) {
                if (qnObjectIndex != 0) {
                    $scope.testcases[qnObjectIndex - 1]["next"] = $scope.testcases[qnObjectIndex].next;
                }
                $scope.testcases.splice(qnObjectIndex, 1);

            }
        }
        // end $scope.removeQuestion



    //     appendNew question into existing path
    $scope.appendQuestion = function (index, QuestionCode1) {
            var index = index;
            var QuestionCode = "";
            QuestionCode = QuestionCode1;

            $scope.NewTestcasesPath = [];
            var qnObject = {};
            var qnObjectArr = [];

            var appendTempObj = {
                "SurveyName": surveyName,
                "For": "WEB",
                "QuestionCode": QuestionCode
            };

            JDPAFactory.getQuestionForAppendTestcase(appendTempObj, function (data, status) {

                if (data[QuestionCode]) {

                    var testcaseObject = {};
                    var qnKeys = Object.keys(data);
                    var qnKey = qnKeys[0];
                    /** add next question to previous  object */
                    var nextQnForCurrentQn = []; 
                    nextQnForCurrentQn.push(qnKey);
                    $scope.testcases[index - 1]["next"] = nextQnForCurrentQn;
                    var responses = [];
                    var responsesGrid = {};
                    var respTempObj = data[qnKey].Responses;
                    var SelectionType = data[qnKey].SelectionType;
                    
                    switch (SelectionType) {
                    case "GridWithCombo":
                    case "GridTextbox":
                    case "GridRadioOrCheckbox":
                        responsesGrid = getGridQuestionResponses(qnKey, data, respTempObj);
                        testcaseObject["response"] = responsesGrid;
                        break;
                    case "MultiDropDown":
                        break;
                    case "SimpleList":
                        var responsesOfList = formatResponsesForSimpleList(qnKey, data);
                        testcaseObject["response"] = responsesOfList;
                        break;
                    default:
                        var responses1 = getSimpleQuestionResponses(respTempObj);
                        testcaseObject["response"] = responses1;
                        break;
                    }
                    
                    var nextIs = [];
                    nextIs.push("Terminate");
                    testcaseObject["question"] = qnKey;
                    testcaseObject["next"] = nextIs;
                    $scope.testcases.push(testcaseObject);
                    $('.table-bordered > tbody tr:last').remove();
                } else {
                    $scope.messageForAppendQn = "Question code '" + QuestionCode + "' is not availble! Please pass correct question code !!";
                    $('#save-alert-ForAppendQuestion').css("display", "block").fadeOut(10000);
                }
            }, function (err) {

            });

        } // end delete

    /** resp object of simple-radio/checkbox/textbox and dropdown(single) */


    function getSimpleQuestionResponses(respObject) {
            var respObjectForSimpleqns = [];
            var tempResponses = respObject;
            var respKeys = Object.keys(tempResponses);

            for (var respIndex = 0; respIndex < respKeys.length - 1; respIndex++) {
                var resK = respKeys[respIndex];
                respObjectForSimpleqns.push(respObject[resK]['value']);
                break;
            }

            return respObjectForSimpleqns;
        } // end resp object of simple-radio/checkbox/textbox and dropdown(single)


    
    // resp object of simple-radio/checkbox/textbox and dropdown(single)
    function getGridQuestionResponses(qnKey, data, respObject) {
            respObjectForGrid = {};
            var colTempArr = [];
            var tempResponses = respObject;
            var row = tempResponses.row;
            var col = tempResponses.col;
            var rowKeys = Object.keys(row);
            var colKeys = Object.keys(col);
            var colK = colKeys[0];
            var colVal = col[colK]['value'];
            colTempArr.push(colVal);

            var responseDependOnRow = "";
            var responseDependOnCol = "";
            responseDependOnRow = data[qnKey].ResponseDependentOnForRow;
            responseDependOnCol = data[qnKey].ResponseDependentOnForCol;
            var responsesOfDependesOn = [];
            var responsesColOfDependesOn = [];
            if (responseDependOnCol != undefined) {
                responsesColOfDependesOn = getResponseDependceOnRow(responseDependOnCol);
            }
            if (responseDependOnRow != undefined) {
                responsesOfDependesOn = getResponseDependceOnRow(responseDependOnRow);
            }
            var indexOfRespListOfDepend = 0;
            var indexOfRespColListOfDepend = 0;
            for (var rowIndex = 0; rowIndex < rowKeys.length; rowIndex++) {
                var rowK = rowKeys[rowIndex];
                var rowVal = row[rowK]['value'];

                if (responsesColOfDependesOn == undefined || responsesColOfDependesOn.length <= 0) {
                    if (rowVal != '' && rowVal.length != 0 && rowVal != undefined) {
                        respObjectForGrid[rowVal] = colTempArr;
                    } else if (responsesOfDependesOn != undefined && responsesOfDependesOn.length > 0) {
                        var rowValOfDependQn = responsesOfDependesOn[indexOfRespListOfDepend];
                        if (rowValOfDependQn != undefined) respObjectForGrid[rowValOfDependQn] = colTempArr;
                        indexOfRespListOfDepend++;
                    }
                } else if (responsesColOfDependesOn != undefined && responsesColOfDependesOn.length > 0) {

                    if (rowVal != '' && rowVal.length != 0 && rowVal != undefined) {

                        if (colTempArr.length >= 1 && colTempArr[0] != 0) {
                            respObjectForGrid[rowVal] = colTempArr;
                        } else {
                            var colTempArrDependsOn = [];
                            colTempArrDependsOn.push(responsesColOfDependesOn[indexOfRespColListOfDepend]);
                            respObjectForGrid[rowVal] = colTempArrDependsOn;
                            indexOfRespColListOfDepend++;
                        }

                    } else if (responsesOfDependesOn != undefined && responsesOfDependesOn.length > 0) {
                        var rowValOfDependQn = responsesOfDependesOn[indexOfRespListOfDepend];
                        if (colTempArr.length >= 1 && colTempArr[0] != 0) {
                            if (rowValOfDependQn != undefined) respObjectForGrid[rowValOfDependQn] = colTempArr;
                        } else {
                            if (indexOfRespColListOfDepend == responsesOfDependesOn.length) indexOfRespColListOfDepend = 0;
                            var colTempArrDependsOn = [];
                            colTempArrDependsOn.push(responsesColOfDependesOn[indexOfRespColListOfDepend]);
                            if (rowValOfDependQn != undefined) respObjectForGrid[rowValOfDependQn] = colTempArrDependsOn;
                            indexOfRespColListOfDepend++;

                        }

                        indexOfRespListOfDepend++;
                    }
                }


            }

            return respObjectForGrid;
        } // end resp object of simple-radio/checkbox/textbox and dropdown(single)
    
    
    
    function formatResponsesForMultiDropDown(qnKey, questionData) {
        var listObje = questionData[qnKey].List;
        var respListKeys = Object.keys(listObje);
        var responses = questionData[qnKey].Responses;
        var dropdownArr = {};
        for (var listIndex = 0; listIndex < respListKeys.length; listIndex++) {
            var listkey = respListKeys[listIndex];
            if (listkey != "col_Count") {
                listkey = listkey + "_1";

                var respVal = responses[listkey].value.value;
                respValuList.push(respVal);
            }
        }
        return respValuList;
    }

    
    
    function formatResponsesForSimpleList(qnKey, questionData) {
        var listObje = questionData[qnKey].List;
        var respListKeys = Object.keys(listObje);
        var responses = questionData[qnKey].Responses;
        var dropdownArr = {};
        var respValuList = [];
        for (var listIndex = 0; listIndex < respListKeys.length; listIndex++) {
            var listkey = respListKeys[listIndex];
            if (listkey != "col_Count") {
                listkey = listkey + "_1";

                var respVal = responses[listkey].value.value;
                respValuList.push(respVal);
                dropdownArr[responses[listkey].value.Name] = respValuList;
            }
        }
        return respValuList;
    }

    
    
    // getRowdependence responses
    function getResponseDependceOnRow(questionCode) {
        var testCaseList = $scope.testcases;
        var respList = [];
        for (var indexOfQnObjecList = 0; indexOfQnObjecList < testCaseList.length; indexOfQnObjecList++) {
            if (testCaseList[indexOfQnObjecList]['question'] == questionCode) {
                respList = testCaseList[indexOfQnObjecList].response;
            }
        }

        return respList;
    }

    
    
    //    add row 
    $scope.AddRow = function () {
        var inputElement = '<tr><td><textarea class="form-control" role="question-label" for="appended-question-code"></textarea></td><td><textarea class="form-control" role="response-object-key" ></textarea></td><td><textarea class="form-control" role="next-question-label" ></textarea></td><td><span class="glyphicon glyphicon-remove" aria-hidden="true" style="margin-top:25px; margin-left:25px; cursor: pointer;" for="appended-question-code1"></span></td></tr>';
        $('.table-bordered > tbody:last').append(inputElement);
    }

    
    
    $('.table-bordered ').on('click', 'span[for="appended-question-code1"]:last', function (e, $index) {
        $('.table-bordered > tbody tr:last').remove();

    });
    
    

    $('.table-bordered ').on('keydown', 'textarea[for="appended-question-code"]:last', function (e, $index) {
        if (e.which == '9') {
            var question = $(this).val();
            var rowCount = $('.table-bordered tr').length;
            var index = rowCount - 2;
            $scope.appendQuestion(index, question);

        }
    });
    
}]);