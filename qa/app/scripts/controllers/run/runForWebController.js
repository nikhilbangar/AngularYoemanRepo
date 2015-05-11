"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("RunForWebController", ["$scope", "JDPAFactory", function ($scope, JDPAFactory) {
    $scope.runBtnStatus = "Run";

    var platform = "";
    var surveyName = "";
    var flag_platform = false;

    // this variable for web/mobile
    var flag_survey_select = false;
    $scope.run_button_hide = true;



    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForWeb(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {

        }); // end of getSurveyNamesFromTestcaseCollection



    // event to select survey name from select box and initialize testcase names
    $(".col-md-2-survey-name-container").find("select").change(function () {
        if ($(this).val() != "Survey") {
            flag_survey_select = true;
            var surveyName = $(this).val();

            JDPAFactory.getTestcaseNames({
                    "SurveyName": surveyName,
                    "For": "WEB"
                },
                function (data, status) {
                    $scope.testcaseNames = Object.keys(data);
                },
                function (err) {});
        }
    });



    /**
     *   Web configuration
     *   details will start
     *   from here!
     */



    // event to hide mobile configuration panel when web button clicks
    $(".btn-web").click(function () {
        $("#collapseMobilePanel").removeClass("in");
    });



    // event to handle driver type selection
    $("select[name='DriverType-select']").change(function () {
        if ($(this).val() == "grid") {
            $("input[name='web-platform-checkbox']").removeClass("hide").addClass("show");
            $("input[name='web-platform']").hide();

            // set all browser checkbox enabled at first moment
            $("input[type='checkbox']").prop("disabled", false);

            // clear all checkbox at first moment
            $("table input[type='checkbox']").prop("checked", false);

        } else
        if ($(this).val() == "webDriver") {
            $("input[name='web-platform-checkbox']").removeClass("show").addClass("hide");
            $("input[name='web-platform']").show();

            // clear all platform radio button at first moment
            $("input[type='radio']").prop("checked", false);

            // clear all browser checkbox at first moment
            $("table input[type='checkbox']").prop("checked", false);

            // set all browser radio disabled at first moment
            $("input[type='checkbox']").prop("disabled", true);

            // set testcase checkbox enabled
            $(".testcase-container input").prop("disabled", false);

            flag_platform = false;
        }
        $("input[name='web-js-error-checkbox']").prop("disabled", false);
    });



    // event to check any of the platform is checked or not
    $("input[name='web-platform-checkbox']").click(function () {
        $("input[name='web-platform-checkbox']:checked").each(function () {
            flag_platform = true;
        });
    });



    // set all browser radio disabled at first moment
    $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", true);
    $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", true);
    $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", true);



    // event mac radio is checked uncheck and disable other row
    $(".web-platform-mac").click(function () {
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", false);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", true);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']:first").prop("checked", true);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("checked", false);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("checked", false);

        platform = $(this).val();
        flag_platform = true;
    });



    // event linux radio is checked uncheck and disable other row
    $(".web-platform-linux").click(function () {
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", true);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", false);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']:first").prop("checked", true);
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("checked", false);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("checked", false);

        platform = $(this).val();
        flag_platform = true;
    });



    // event win7 radio is checked uncheck and disable other row
    $(".web-platform-win7").click(function () {
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("disabled", true);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("disabled", true);
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']").prop("disabled", false);

        // check first bydefault and uncheck rest
        $(".web-platform-win7").parents("tr").find("input[name='web-win7-browser']:first").prop("checked", true);
        $(".web-platform-mac").parents("tr").find("input[name='web-mac-browser']").prop("checked", false);
        $(".web-platform-linux").parents("tr").find("input[name='web-linux-browser']").prop("checked", false);

        platform = $(this).val();
        flag_platform = true;
    });



    // event to select all testcases
    $("input[name='all-testcase-checkbox']").change(function () {
        if ($("input[name='all-testcase-checkbox']").is(":checked")) {
            $(".testcaseNamesContainer input").prop("checked", true);
        } else {
            $(".testcaseNamesContainer input").prop("checked", false);
        }
    });



    // function to handle grid json creation
    function createJSONForGrid() {
        var configurationValueObject = {};
        $("input[name='web-platform-checkbox']:checked").each(function () {
            var platform = $(this).val();
            var browser = [];
            $(this).parents("tr").find("input[role='web-browser-name']:checked").each(function () {
                var browser_name = $(this).val();
                browser.push(browser_name);
            });
            configurationValueObject[platform] = browser;
        });

        return configurationValueObject;
    }



    // function to handle webDriver json creation
    function createJSONForWebDriver() {
        var configurationValueObject = {};
        $("input[name='web-platform']:checked").each(function () {
            var browser = [];
            $(this).parents("tr").find("input[role='web-browser-name']:checked").each(function () {
                var browser_name = $(this).val();
                browser.push(browser_name);
            });
            configurationValueObject[platform] = browser;
        });

        return configurationValueObject;
    }



    // function to handle saving and generating web configuration details in json
    $scope.save_web_configuration = function () {
        var driverType = $("select[name='DriverType-select']").val();
        var configurationKeyObject = {};
        var testcaseArray = [];
        var flag_testcase_select = false;

        $(".testcase-container input").each(function () {
            if ($(this).is(":checked")) {
                flag_testcase_select = true;
            }
        });

        if (flag_survey_select) {
            if (flag_testcase_select) {
                if (flag_platform) {
                    var js_error = "NO";
                    if ($("input[name='web-js-error-checkbox']").is(':checked')) js_error = "YES";

                    configurationKeyObject["Survey Name"] = $(".col-md-2-survey-name-container").find("select").val();
                    configurationKeyObject["For"] = "WEB";
                    configurationKeyObject["DriverType"] = $("select[name='DriverType-select']").val();
                    configurationKeyObject["JSError"] = js_error;

                    $(".testcaseNamesContainer input").each(function () {
                        if ($(this).is(":checked")) {
                            testcaseArray.push($(this).val());
                        }
                    });

                    configurationKeyObject["Testcases"] = testcaseArray;
                    if (driverType == "webDriver") {
                        configurationKeyObject["Data"] = createJSONForWebDriver();
                    } else
                    if (driverType == "grid") {
                        configurationKeyObject["Data"] = createJSONForGrid();
                    }

                    // post web configuration details to service
                    JDPAFactory.postConfiguration(configurationKeyObject,
                        function (data, status) {
                            $scope.message = data;

                            if (status == "201") {
                                $('#save-alert').removeClass()
                                    .addClass("alert alert-success");
                                $timeout(function () {}, 4000);
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
                    $scope.run_button_hide = false;
                } else {
                    alert("Please select/click platform!");
                }
            } else {
                alert("select testcase!");
            }
        } else {
            alert("Please select survey!");
        }

    };



    $scope.runConfiguration = function () {
        $scope.runBtnStatus = "Running";
        JDPAFactory.getRunConfig("WEB",
            function (data, status) {
                $scope.runBtnStatus = "Completed!";
            },
            function (err) {});
    };



    // function to handle showing and hiding run button
    $scope.showConfigurationPanel = function () {
        $scope.run_button_hide = true;
    };

}]);