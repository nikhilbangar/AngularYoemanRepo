"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("EditTestcaseMobileController", ["$scope", "$log", "$http", "JDPAFactory", function ($scope, $log, $http, JDPAFactory) {
    var testcaseData = [];
    $scope.testcases = [];
    var surveyName = "";
    var testcaseName = "";

    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForMobile(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {

        }); // end of getSurveyNamesFromTestcaseCollection



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
                    "For": "MOBILE"
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
                    "For": "MOBILE"
                },
                function (data, status) {
                    var questions = Object.keys(data[testcaseName]);
                    var questionsOrderList = [];
                    Global_testgoal = data[testcaseName].TestGoal;

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
                        var index = data[testcaseName][question].index;

                        testcaseObject["question"] = question;
                        testcaseObject["response"] = response;
                        testcaseObject["next"] = next;
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

    $scope.isObject = function (response) {
        if (angular.isArray(response)) {}
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

            $(this).find("textarea[role='response-value']").each(function () {
                responseArray.push($(this).val());
            });
            $(this).find("textarea[role='next-question-label']").each(function () {
                nextArray.push($(this).val());
            });

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

            questionKeyObject[question_label] = questionValueObject;

            questionKeyObject["TestGoal"] = Global_testgoal;
        });

        questionObject["Survey Name"] = surveyName;
        questionObject["For"] = "MOBILE";
        questionObject["Testcase Name"] = testcaseName;
        questionObject["Data"] = questionKeyObject;

        JDPAFactory.postEditedTestcase(questionObject,
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



    // updated new
    /** -----NEW CODE FOR ADD/DELETE QUESTION FROM TESTCASE PATH----- **/
    // -parshuram : to "delete" the question from testcase object
    $scope.removeQuestion = function (qnObjectIndex) {
            if (confirm("Are you sure you want to delete ...?")) {
                if (qnObjectIndex != 0) {
                    $scope.testcases[qnObjectIndex - 1]["next"] = $scope.testcases[qnObjectIndex].next;
                }
                $scope.testcases.splice(qnObjectIndex, 1);
            }
        }
        // end delete


    //     appendNew question into existing path
    $scope.appendQuestion = function (index, QuestionCode) {
            var index = index;
            var QuestionCode = QuestionCode;

            $scope.NewTestcasesPath = [];
            var qnObject = {};
            var qnObjectArr = [];

            var appendTempObj = {
                "SurveyName": surveyName,
                "For": "MOBILE",
                "QuestionCode": QuestionCode
            };

            JDPAFactory.getQuestionForAppendTestcase(appendTempObj, function (data, status) {

                if (data[QuestionCode]) {
                    var testcaseObject = {};
                    var qnKeys = Object.keys(data);
                    var qnKey = qnKeys[0];
                    // add next question to previous  object

                    var nextQnForCurrentQn = [];
                    nextQnForCurrentQn.push(qnKey);

                    if (index > 0) $scope.testcases[index - 1]["next"] = nextQnForCurrentQn;

                    var responses = [];
                    var responsesGrid = {};
                    var respTempObj = data[qnKey].Responses;
                    var SelectionType = data[qnKey].SelectionType;

                    switch (SelectionType) {
                    case "StandardAttributeGrid":
                    case "OSATGrid":
                        responsesGrid = getGridQuestionResponses(respTempObj);
                        testcaseObject["response"] = responsesGrid;
                        break;
                    case "MultiDropDown":
                        var responsesOfMultiDropDown = formatResponsesForMultiDropDown(qnKey, data);
                        testcaseObject["response"] = responsesOfMultiDropDown;
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



    function getGridQuestionResponses(respObject) {
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
            
            for (var rowIndex = 0; rowIndex < rowKeys.length; rowIndex++) {
                var rowK = rowKeys[rowIndex];
                respObjectForGrid[row[rowK]['value']] = colTempArr;
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
            if (listkey != "Column_Count") {
                listkey = listkey + "_1";
                var respValuList = [];
                var respVal = responses[listkey].value.value;
                respValuList.push(respVal);
                dropdownArr[responses[listkey].value.Name] = respValuList;
            }
        }

        return dropdownArr;
    }



    //    add row 
    $scope.AddRow = function () {
        var inputElement = '<tr><td><textarea class="form-control" role="question-label" for="appended-question-code"></textarea></td><td><textarea class="form-control" role="response-object-key" ></textarea></td><td><textarea class="form-control" role="next-question-label" ></textarea></td><td><span class="glyphicon glyphicon-remove" aria-hidden="true" style="margin-top:25px; margin-left:25px; cursor: pointer;" for="appended-question-code1"></span></td></tr>';
        $('.table-bordered > tbody:last').append(inputElement);
    }

    $('.glyphicon-remove').on("click", function (e, index) {});



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