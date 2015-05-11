"use strict";

var qaApp = angular.module("qaApp");

//This controller provides the functionality to review screenshot
qaApp.controller('ReviewScreenshotController', ["$scope", "$log", "JDPAFactory",
    function ($scope, $log, JDPAFactory) {
        var surveyName = null,
            testcaseData = null,
            images = [],
            index = 0,
            imageDirectory = null,
            imageName = "default",
            SEVER_ERROR = "Internal server error, try again!",
            POSSIBLE_SEVER_ERROR_WHEN_NO_SURVEY = "No Survey Ready for Screen Shot Review - You may need to run one",
            testcaseInfo = [],
            currentReadyPlatform = "",
            screenshotPlatform = {},
            lengthOfImages = 0;

        
        
        // function to handle survey names for which screenshots have been generated
        JDPAFactory.getDefaultStateFromSurveyScreeshot(
            function (data, status) {
                if (data && data.length) {
                    $scope.surveyNames = data;
                    show($('.survey-name-container'));
                    hide($('.no-survey-container'));
                } else {
                    $scope.noSurvey = "Survey not available, run test for survey!";
                    hide($('.survey-name-container'));
                    show($('.no-survey-container'));
                }
            },
            function (err , status) {
            	$scope.noSurvey = SEVER_ERROR;
                hide($('.survey-name-container'));
                show($('.no-survey-container'));
            }
        );
        
        
        
        var status = '';

        
        
        //function to dispaly platform, version, device and orientation on testcase selection
        $scope.selectTestcase = function (testcaseName) {
            hide($("div.config-container"));
            hide($("div.screenshot-container"));
            hide($('.tested-screenshot'));

            if (!$('.testcase-select').val() || !$("div.survey-name-container select").val()) {
                return;
            }

            JDPAFactory.getSessionsForTestcase({
                    "SurveyName": surveyName,
                    "TestcaseName": testcaseName
                },
                function (data, status) {
                    testcaseInfo = data;
                    var configKeys = Object.keys(testcaseInfo),
                        configObject = {},
                        mobilePlatforms = [];
                    $scope.androidDeviceArray = [];
                    $scope.androidDeviceArrayFilter = [];
                    $scope.iOSDeviceArray = [];
                    $scope.iOSDeviceArrayFilter = [];

                    // loop 0,1,2,3..path
                    $.each(configKeys, function (index, item) {
                        configObject = testcaseInfo[item];
                        if (configObject.Platforms) {
                            // each of 0,1,2,...
                            $.each(configObject.Platforms, function (index, platform) {

                                if ($.inArray(platform, mobilePlatforms) === -1) {
                                    mobilePlatforms.push(platform);
                                }

                                var devices = Object.keys(testcaseInfo[item][platform]);
                                var changeCasePlatform = platform.toLowerCase();
                                $.each(devices, function (index, device) {
                                    var imgDir = testcaseInfo[item][platform][device][testcaseName]["ImageDir"];
                                    var tcStatus = testcaseInfo[item][platform][device][testcaseName]["Status"];
                                    
                                    var filterObject = {};
                                    switch (changeCasePlatform) {
                                    case "android":
                                        filterObject["Device"] = device;
                                        filterObject["ImgDir"] = imgDir;

                                        $scope.androidDeviceArray.push(device);
                                        $scope.androidDeviceArrayFilter.push(filterObject);
                                        $scope.status = tcStatus;
                                        break;
                                    case "ios":
                                        filterObject["Device"] = device;
                                        filterObject["ImgDir"] = imgDir;
                                        $scope.status = tcStatus;
                                        $scope.iOSDeviceArray.push(device);
                                        $scope.iOSDeviceArrayFilter.push(filterObject);
                                        break;
                                    }
                                });

                            });
                        }
                        hide($(".device-data-container"));

                    });
                    if (mobilePlatforms.length) {
                        show($("div.config-container"));
                        hide($('.no-platform'));
                        $scope.platforms = mobilePlatforms;
                    } else {
                        $scope.mobileConfigMessage = "No platform available";
                        hide($("div.config-container"));
                        show($('.no-platform'));
                    }
                },
                function (err) {
                    $scope.mobileConfigMessage = SEVER_ERROR;
                    show($('.no-data'));
                    hide($('.test-data-container'));
                });

        }

        
        
        $scope.getDeviceDataByPlatform = function (platform) {
            currentReadyPlatform = platform;
            var changeCasePlatform = platform.toLowerCase();

            switch (changeCasePlatform) {
            case "android":
                $scope.devices = $scope.androidDeviceArrayFilter;
                break;
            case "ios":
                $scope.devices = $scope.iOSDeviceArrayFilter;
                break;
            }


            show($('.device-data-container'));
        }



        //function to review corresponding configured images on clicking "Review"
        $scope.review = function (imagePath) {
            index = 0;
            imageDirectory = imagePath;
            images = testcaseInfo.Path;
            lengthOfImages = images.length;
            $log.warn('How many images:' + lengthOfImages);
            if (lengthOfImages) {
            	$scope.questionCode = images[index]; 
                getScreenshotPath(imagePath, images[index]);
                $('.tested-screenshot').removeClass('hide').addClass('show');
                $('.no-screenshot').removeClass('show').addClass('hide');
                checkForNextPrevious(lengthOfImages, index);
            } else {
                $log.info('no images');
                hide($('.tested-screenshot'));
                $scope.mobileScreenshotMessage = "screen shot not available!";
                $('.no-screenshot').css("display", "block").fadeOut(6000);
            }

        }

        
        
        //function to get previous screenshot
        $scope.previousScreenshot = function (testcaseName) {
            if (index < 1) {
                index = images.length;
            }
            imageName = images[--index];
            getScreenshotPath(imageDirectory, imageName);
            checkForNextPrevious(lengthOfImages, index);
            $scope.questionCode = imageName;
        };

        
        
        //function to get next screenshot
        $scope.nextScreenshot = function (testcaseName) {
            if (index >= images.length - 1) {
                index = -1;
            }
            imageName = images[++index];
            getScreenshotPath(imageDirectory, imageName);
            checkForNextPrevious(lengthOfImages, index);
            $scope.questionCode = imageName;
        };

        
        
        $("div.survey-name-container select").on('change', function () {
            surveyName = $(this).val();
            $('.testcase-select option.default').attr("selected", true);
            hide($("div.config-container"));
            hide($("div.screenshot-container"));
            if (!surveyName) {
                $scope.testcaseNames = [];
                return;
            }

            // function to handle fetch survey names from db
            JDPAFactory.getTestcaseNamesForScreenshot(surveyName,
                function (data, status) {
                    if (data && data.length) {
                        testcaseData = data;
                        $scope.testcaseNames = testcaseData;
                        show($("div.testcase-container"));
                        hide($("div.no-testcase-container"));
                    } else {
                        $scope.noTestcase = "No testcase available, please create a testcase";
                        hide($("div.testcase-container"));
                        show($("div.no-testcase-container"));
                    }
                },
                function (err) {
                    $scope.testcaseNames = [];
                    $scope.noTestcase = SEVER_ERROR;
                    hide($("div.testcase-container"));
                    show($("div.no-testcase-container"));
                }); // end of getTestcaseNames
        });


        
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

        
        
        //this function returns path of screenschot
        function getScreenshotPath(imageDir, imageName) {
            var realPath = imageDir + "_" + imageName + ".png";

            JDPAFactory.getImagePathByOS({
                    "path": realPath
                },
                function (data, status) {
                    $scope.screenshotPath = "http://30.30.30.114:8090/jdpawebapp/app/screen_capture/" + data.data;
                    show($('.screenshot-container'));
                },
                function (error) {
                    console.dir(error);
                });
        }

        
        
        //This function hides an element
        function hide(element) {
            element.removeClass('show').addClass('hide');
        }

        
        
        //This function shows an element
        function show(element) {
            element.removeClass('hide').addClass('show');
        }

        
        
        //This function disables an element
        function disable(htmlElement) {
            htmlElement.attr("disabled", true);
        }

        
        
        //This function enables an element
        function enable(htmlElement) {
            htmlElement.attr("disabled", false);
        }

        
        
        //This function checks for enabling or disabling next or previous button
        function checkForNextPrevious(imageLength, imageIndex) {
            if (imageLength <= 1) {
                disable($(".next"));
                disable($(".previous"));
            } else if (imageLength - 1 === imageIndex) {
                disable($(".next"));
                enable($(".previous"));
            } else if (imageIndex === 0) {
                enable($(".next"));
                disable($(".previous"));
            } else if (imageIndex >= 1 && imageIndex < imageLength - 1) {
                enable($(".next"));
                enable($(".previous"));
            }
        }
        
    }]);