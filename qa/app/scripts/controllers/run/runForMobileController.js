"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("RunForMobileController", ["$scope", "JDPAFactory", function ($scope, JDPAFactory) {
    $scope.runBtnStatus = "Run";

    // web variable declarations 
    var surveyName = "";
    $scope.surveyName = "Survey Name";

    // mobile variable declarations 
    var mobile_platform = "";
    var mobile_version = "";
    var flag_mobile_platform = false;
    var flag_mobile_platform_for_grid = false;
    var flag_android_mobile_platform_for_grid = false;
    var flag_android_mobile_version_for_grid = false;
    var flag_ios_mobile_version_for_grid = false;
    var flag_mobile_version_for_grid = false;

    // this variable for web/mobile
    var flag_survey_select = false;
    $scope.run_button_hide = true;
    $scope.devices = [];
    $scope.showMobileConfigTable = true;



    // function to handle fetch survey names from db
    JDPAFactory.getSurveyNamesForMobile(
        function (data, status) {
            $scope.surveyNames = data;
        },
        function (err) {

        }); // end of getSurveyNamesFromTestcaseCollection



    // event to select survey name from select box
    $(".col-md-2-survey-name-container").find("select").change(function () {
        if ($(this).val() != "Survey") {
            flag_survey_select = true;
            var surveyName = $(this).val();
            $scope.surveyName = $(this).val();

            JDPAFactory.getTestcaseNames({
                    "SurveyName": surveyName,
                    "For": "MOBILE"
                },
                function (data, status) {
                    $scope.testcaseNames = Object.keys(data);
                },
                function (err) {});
        }
    });



    /**
     *   Mobile configuration
     *   details for grid
     *
     */



    // event to load select box for particular android version
    $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version-checkbox']").click(function () {
        var mobile_version_checkbox = $(this).val();
        var day = "";

        switch (mobile_version_checkbox) {
        case "Android 5.0":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.androidDevices5_0 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        case "Android 4.3":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.androidDevices4_3 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        case "Android 4.2":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.androidDevices4_2 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        case "Android 4.1":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.androidDevices4_1 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        }
    });



    // event to load select box for particular ios version
    $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version-checkbox']").click(function () {
        var mobile_version_checkbox = $(this).val();

        switch (mobile_version_checkbox) {
        case "iOS 8.1":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.iosDevices8_1 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        case "iOS 8.0":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.iosDevices8_0 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        case "iOS 7.1":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.iosDevices7_1 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        case "iOS 7.0":
            JDPAFactory.getMobileDeviceData(
                function (data, status) {
                    $scope.iosDevices7_0 = data[mobile_version_checkbox];
                },
                function (err) {}
            );
            break;
        }
    });



    // event to check any of the platform is checked or not
    $("input[name='mobile-platform-checkbox']").click(function () {
        $("input[name='mobile-platform-checkbox']:checked").each(function () {
            flag_android_mobile_platform_for_grid = true;
        });
    });



    // event to check any of the android version is checked or not
    $("input[name='mobile-android-version-checkbox']").click(function () {
        $(this).parents("tr").find("input[name='mobile-android-version-checkbox']:checked").each(function () {
            flag_android_mobile_version_for_grid = true;
        });
    });



    // event to check any of the ios version is checked or not
    $("input[name='mobile-ios-version-checkbox']").click(function () {
        $(this).parents("tr").find("input[name='mobile-ios-version-checkbox']:checked").each(function () {
            flag_ios_mobile_version_for_grid = true;
        });
    });



    /**
     *   Mobile configuration
     *   details will start
     *   from here!
     */



    // event to hide web configuration panel when mobile button clicks
    $(".btn-mobile").click(function () {
        $("#collapseWebPanel").removeClass("in");
    });



    // set all versions radio disabled at first moment
    $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("disabled", true);
    $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("disabled", true);



    // event android radio is checked uncheck and disable other row
    $(".mobile-platform-android").click(function () {
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("disabled", false);
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']:first").prop("checked", true);
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("checked", false);

        mobile_platform = $(this).val();
        mobile_version = $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']:first").val();
        flag_mobile_platform = true;

        getMobileDeviceData(mobile_version);
    });



    // event ios radio is checked uncheck and disable other row
    $(".mobile-platform-ios").click(function () {
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").prop("disabled", false);
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("disabled", true);

        // check first bydefault and uncheck rest
        $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']:first").prop("checked", true);
        $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").prop("checked", false);

        mobile_platform = $(this).val();
        mobile_version = $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']:first").val();
        flag_mobile_platform = true;

        getMobileDeviceData(mobile_version);
    });



    // event to collect versions under andriod
    $(".mobile-platform-android").parents("tr").find("input[name='mobile-android-version']").click(function () {
        mobile_version = $(this).val();
        getMobileDeviceData(mobile_version);
    });



    // event to collect versions under ios
    $(".mobile-platform-ios").parents("tr").find("input[name='mobile-ios-version']").click(function () {
        mobile_version = $(this).val();
        getMobileDeviceData(mobile_version);
    });



    // function to handle saving and generating mobile configuration details in json
    $scope.save_mobile_configuration = function () {
        var driverType = $("select[name='driver-type']").val();
        if (driverType === "webDriver") {
            saveForWebDriver();
        } else
        if (driverType === "grid") {
            saveForGrid();
        }
    };



    // event to select all testcases
    $("input[name='all-testcase-checkbox']").change(function () {
        if ($("input[name='all-testcase-checkbox']").is(":checked")) {
            $(".testcaseNamesContainer input").prop("checked", true);
        } else {
            $(".testcaseNamesContainer input").prop("checked", false);
        }
    });



    // function to save configuration detail for webDriver
    function saveForWebDriver() {
        var configurationKeyObject = {};
        var configurationValueObject = {};
        var instanceObject = {};
        var instanceArray = [];
        var testcaseArray = [];
        var flag_testcase_select = false;
        var deviceName = $("select[name='device-name-select']").val();
        var deviceOrientation = $("select[name='device-orientation-select']").val();

        $(".testcase-container input").each(function () {
            if ($(this).is(":checked")) {
                flag_testcase_select = true;
            }
        });
        
        if(deviceName == 'Device'){
            alert("Select Device!");
            return;
        }

        if (flag_survey_select) {
            if (flag_testcase_select) {
                if (flag_mobile_platform) {
                    configurationValueObject["Platform"] = mobile_platform;
                    var mobile_var = mobile_version.split(" ");
                    configurationValueObject["Version"] = mobile_var[1];
                    configurationValueObject["DeviceName"] = deviceName;
                    configurationValueObject["Device_Orientation"] = deviceOrientation;

                    configurationKeyObject["Survey Name"] = $(".col-md-2-survey-name-container").find("select").val();
                    configurationKeyObject["For"] = "MOBILE";
                    configurationKeyObject["DriverType"] = "webDriver";

                    if ($("input[name='compare-screen']").is(":checked")) {
                        configurationKeyObject["CompareScreen"] = "YES";
                    } else {
                        configurationKeyObject["CompareScreen"] = "NO";
                    }

                    if ($("input[name='test-controls']").is(":checked")) {
                        configurationKeyObject["TestControls"] = "YES";
                    } else {
                        configurationKeyObject["TestControls"] = "NO";
                    }

                    if ($("input[name='take-screenshot']").is(":checked")) {
                        configurationKeyObject["TakeScreens"] = "YES";
                    } else {
                        configurationKeyObject["TakeScreens"] = "NO";
                    }

                    instanceArray.push(configurationValueObject);

                    instanceObject["instances"] = instanceArray;

                    $(".testcaseNamesContainer input").each(function () {
                        if ($(this).is(":checked")) {
                            testcaseArray.push($(this).val());
                        }
                    });

                    configurationKeyObject["Testcases"] = testcaseArray;


                    configurationKeyObject["Data"] = instanceObject;

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
                alert("Please select testcase!");
            }
        } else {
            alert("Please select survey!");
        }
    }



    // function to save configuration detail for grid
    function saveForGrid() {
        var flag_testcase_select = false;
        var testcaseArray = [];

        $(".testcase-container input").each(function () {
            if ($(this).is(":checked")) {
                flag_testcase_select = true;
            }
        });

        if (flag_testcase_select) {
            if (validateGrid()) {
                var configurationKeyObject = {};

                configurationKeyObject["Survey Name"] = $(".col-md-2-survey-name-container").find("select").val();
                configurationKeyObject["For"] = "MOBILE";
                configurationKeyObject["DriverType"] = "grid";

                if ($("input[name='compare-screen']").is(":checked")) {
                    configurationKeyObject["CompareScreen"] = "YES";
                } else {
                    configurationKeyObject["CompareScreen"] = "NO";
                }

                if ($("input[name='test-controls']").is(":checked")) {
                    configurationKeyObject["TestControls"] = "YES";
                } else {
                    configurationKeyObject["TestControls"] = "NO";
                }

                if ($("input[name='take-screenshot']").is(":checked")) {
                    configurationKeyObject["TakeScreens"] = "YES";
                } else {
                    configurationKeyObject["TakeScreens"] = "NO";
                }

                $(".testcaseNamesContainer input").each(function () {
                    if ($(this).is(":checked")) {
                        testcaseArray.push($(this).val());
                    }
                });

                configurationKeyObject["Testcases"] = testcaseArray;

                configurationKeyObject["Data"] = getInstanceObjectKey();

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

            }
        } else {
            alert("Please select testcase!");
        }

    }


    // function to return instanceObjectKey for grid
    function getInstanceObjectKey() {
        var instanceArray = [];
        var instanceObjectKey = {};

        $("input[name='mobile-platform-checkbox']:checked").each(function () {
            var platform = $(this).val();

            $(this).parents("tr").find("input[for='mobile-version-checkbox']:checked").each(function () {
                var instanceObjectValue = {};
                var version = $(this).val();
                var mobile_var = version.split(" ");
                var device = $(this).parents("td").find("select[name='device-name-select']").val();
                var orientation = $(this).parents("td").find("select[name='device-orientation-select']").val();

                instanceObjectValue["Platform"] = platform;
                instanceObjectValue["Version"] = mobile_var[1];
                instanceObjectValue["DeviceName"] = device;
                instanceObjectValue["Device_Orientation"] = orientation;
                instanceArray.push(instanceObjectValue);
            });
        });

        instanceObjectKey["instances"] = instanceArray;

        return instanceObjectKey;
    }



    // common utility to get device data based on mobile_version
    function getMobileDeviceData(mobile_version) {
        JDPAFactory.getMobileDeviceData(
            function (data, status) {
                $scope.mobileDeviceData = data;
                $scope.devices = data[mobile_version];
            },
            function (err) {}
        );
    }

    

    // function to run configuration for web/mobile
    $scope.runConfiguration = function () {
        $scope.runBtnStatus = "Running";
        JDPAFactory.getRunConfig("MOBILE",
            function (data, status) {
                $scope.runBtnStatus = "Completed!";
            },
            function (err) {});
    };

    

    // function to handle showing and hiding run button
    $scope.showConfigurationPanel = function () {
        $scope.run_button_hide = true;
    };



    // function to validate for grid
    function validateGrid() {
        if (flag_survey_select) {} else {
            alert("Please select survey!");
        }

        if (checkDeviceIsSelected()) {} else {
            alert("Please select device!");
        }

        if (flag_android_mobile_version_for_grid || flag_ios_mobile_version_for_grid) {
            flag_mobile_version_for_grid = true;
        } else {
            alert("Please select any of the version!");
        }

        if (flag_android_mobile_platform_for_grid) {} else {
            alert("Please select any of the platform!");
        }

        if (flag_survey_select && flag_android_mobile_platform_for_grid && flag_mobile_version_for_grid && checkDeviceIsSelected()) {
            return true;
        } else {
            return false;
        }
    }



    // event to check device name is selected or not
    function checkDeviceIsSelected() {
        var flag = false;
        $("input[name='mobile-platform-checkbox']:checked").each(function () {
            $(this).parents("tr").find("input[for='mobile-version-checkbox']:checked").each(function () {
                var device = $(this).parents("td").find("select[name='device-name-select']").val();
                if (device != "device") {
                    flag = true;
                }
            });
        });
        return flag;
    }



    // event to show and hide webDriver and grid table
    $("select[name='driver-type']").change(function () {
        var driverType = $(this).val();

        if (driverType === "webDriver") {
            $(".table-mobile-webDriver").removeClass("hide").addClass("show");
            $(".table-mobile-grid").removeClass("show").addClass("hide");
            $("input[type='radio']").prop("checked", false);
            $("input[name='mobile-android-version']").prop("disabled", true);
            $("input[name='mobile-ios-version']").prop("disabled", true);
        } else
        if (driverType === "grid") {
            $(".table-mobile-grid").removeClass("hide").addClass("show");
            $(".table-mobile-webDriver").removeClass("show").addClass("hide");
            $(".table-mobile-grid input[type='checkbox']").prop("checked", false);
        }

        $("input[name='compare-screen']").prop("checked", false);
        $("input[name='test-controls']").prop("checked", false);
    });

}]);