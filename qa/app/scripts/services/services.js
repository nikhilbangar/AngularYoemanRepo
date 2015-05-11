'use strict';

/**
 * @ngdoc service
 * @name qaApp.services
 * @description
 * # services
 * Factory in the qaApp.
 */
angular.module('qaApp')
  .factory('JDPAFactory', function ($http) {
    // Service logic
    // ...

    var getIpConfig = function () {
        var url = './resources/ipConfig.properties';
        return $http.get(url);
    };

    //var meaningOfLife = 42;

    // Public API here
    return {
       postTestCaseJSON: function (surveyName, success, error) {
            console.log('surveyName: ' + JSON.stringify(surveyName));

            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.testcasegenrater;

                $http.post(url, surveyName).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        postQuestionJSON: function (questionJSON, success, error) {
            console.log('service questionJSON: ' + JSON.stringify(questionJSON));

            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.questiondata;

                $http.post(url, questionJSON).success(function (result) {
                    success(result);
                }).error(error);

            });
        },
        postListQuestionJSON: function (questionJSON, success, error) {
            console.log('service questionJSON: ' + JSON.stringify(questionJSON));

            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.questionUpdate;

                $http.post(url, questionJSON).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getSurveyNamesForWeb: function (success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.listofSurveynameforweb;

                $http.get(url).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getSurveyNamesForMobile: function (success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.listofSurveynameformobile;

                $http.get(url).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getSurveyNameForPartialSurveyForMobile: function (success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.listOfSurveyNamesForMobilePartial;

                $http.get(url).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getPartialQuestionData: function (tempObject, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.partialQuestionData;

                $http.post(url, tempObject).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getQuestionJSONToEdit: function (surveyNameCollection, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getQuestionData;

                $http.post(url, surveyNameCollection).success(function (result) {
                    success(result);
                }).error(error);

            });
        },
        getSurveyNamesFromTestcaseCollection: function (success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.listofSurveyname;

                $http.get(url).success(function (result) {
                    success(result);
                }).error(error);

            });
        },
        getTestcaseNames: function (surveyCollectionName, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.listofTestcaseName;

                $http.post(url, surveyCollectionName).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        postEditedQuestion: function (editedQuestionDocument, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.questionUpdate;

                $http.post(url, editedQuestionDocument).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        postEditedTestcase: function (editedTestcaseDocument, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.testcaseupdate;

                $http.post(url, editedTestcaseDocument).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        saveManualTraversalPath: function (testcaseDocument, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.saveManualTraversalPath;

                $http.post(url, testcaseDocument).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        postConfiguration: function (ConfigurationDetails, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.configurationfile;

                $http.post(url, ConfigurationDetails).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getSpecificQuestionList: function(dataForSpecificQuestion,success,err){
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getSpecificQuestionList;
                
                $http.post(url, dataForSpecificQuestion).success(function (result) {
                    success(result);
                }).error(err);
            });
        },
        getMobileDeviceData: function (success, error) {
            var url = './resources/mobile_device_configData.json';

            $http.get(url).success(function (result) {
                success(result);
            }).error(error);
        },
        getPlatformsForWebReport: function (reportName, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getReportsForWeb;

                $http.post(url, reportName).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getPlatformsForMobileReport: function (reportName, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getReportsForMobile;

                $http.post(url, reportName).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getRunConfig: function (forWhat, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.runTestcase;

                $http.post(url, forWhat).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getListOfReport: function (forWhat, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getListOfReport;

                $http.post(url, forWhat).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getSessionsByTestcase: function (testcaseName, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getSessionsByTestcase;

                $http.get(url, testcaseName).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getDefaultStateFromSurveyScreeshot: function (success, error) {
          getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getDefaultStateFromSurveyScreeshot;

                $http.get(url).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getTestcaseNamesForScreenshot: function (surveyName, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getTestcaseNamesForScreenshot;

                $http.post(url,surveyName).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getSessionsForTestcase: function (testcaseInfo, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getSessionsForTestcase;

                $http.post(url,testcaseInfo).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getConfigsForSession: function (sessionName, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getConfigsForSession;

                $http.post(url,sessionName).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getImagePathByOS: function(path, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + data.data.getImagePathByOS;

                $http.post(url,path).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
         getQuestionsForManualTestcase: function (tempObject, success, error) {
            getIpConfig().then(function (data) {
                var url = data.data.domain + 'jdpawebapp/rest/jdpawebapp/getQuestionsForManualTestcase';

                $http.post(url,tempObject).success(function (result) {
                    success(result);
                }).error(error);
            });
        },
        getQuestionForAppendTestcase: function (tempObject, success, error) {
             getIpConfig().then(function (data) {
                var url = data.data.domain + 'jdpawebapp/rest/jdpawebapp/questionforappendtestcase';

                 $http.post(url,tempObject).success(function (result) {
                    success(result);
                }).error(error);
            });
        }
    };
  });
