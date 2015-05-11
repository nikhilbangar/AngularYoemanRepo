'use strict';

/**
 * @author nikhil bangar
 * @ngdoc overview
 * @name qaApp
 * @description
 * # qaApp
 *
 * Main module of the application.
 */
 angular
 .module('qaApp', [
  'ngRoute'
  ])
 .config(function ($routeProvider) {
  $routeProvider
  .when('/', {
        templateUrl: 'views/main/main.html'/*,
        controller: 'MainCtrl'*/
      })
  .when('/about', {
    templateUrl: 'views/about/about.html',
    controller: 'AboutCtrl'
  })
  .when('/createSurveyForWeb', {
    templateUrl: 'views/create/createSurveyForWeb.html',
    controller: 'CreateSurveyForWebController'
  })
  
  .when('/createNewSurveyForWeb', {
    controller: 'CreateNewSurveyForWebController',
    templateUrl: 'views/create/createNewSurveyForWeb.html'
  })
  .when('/continuePendingSurveyForWeb', {
    controller: 'ContinuePendingSurveyForWebController',
    templateUrl: 'views/create/continuePendingSurveyForWeb.html'
  })
  .when('/createSurveyForMobile', {
    controller: 'CreateSurveyForMobileController',
    templateUrl: 'views/create/createSurveyForMobile.html'
  })
  .when('/createNewSurveyForMobile', {
    controller: 'CreateNewSurveyForMobileController',
    templateUrl: 'views/create/createNewSurveyForMobile.html'
  })
  .when('/continuePendingSurveyForMobile', {
    controller: 'ContinuePendingSurveyForMobileController',
    templateUrl: 'views/create/continuePendingSurveyForMobile.html'
  })
  .when('/ReadyPendingSurveyForMobile/:surveyName', {
    controller: 'ReadyPendingSurveyForMobileController',
    templateUrl: 'views/create/readyPendingSurveyForMobile.html'
  })
  .when('/question/Web/:filename', {
    controller: 'CreateQuestionForWebController',
    templateUrl: 'views/create/createQuestionForWeb.html'
  })
  .when('/question/Mobile/:filename', {
    controller: 'CreateQuestionForMobileController',
    templateUrl: 'views/create/createQuestionForMobile.html'
  })
  .when('/edit/Testcase', {
            controller: 'EditTestcaseWebController',
            templateUrl: 'views/edit/edit_testcase_web.html'
        })
        .when('/edit/Question', {
            controller: 'EditQuestionWebController',
            templateUrl: 'views/edit/edit_question_web.html'
        })
        .when('/edit/Question/Mobile', {
            controller: 'EditQuestionMobileController',
            templateUrl: 'views/edit/edit_question_mobile.html'
        })
        .when('/edit/Testcase/Mobile', {
            controller: 'EditTestcaseMobileController',
            templateUrl: 'views/edit/edit_testcase_mobile.html'
        })
        .when('/review/ScreenShot/Mobile', {
            controller: 'ReviewScreenshotController',
            templateUrl: 'views/edit/review_screenshot.html'
        })
        .when('/generateForWeb', {
            controller: 'GenerateForWebController',
            templateUrl: 'views/generateTest/generateForWeb.html'
        })
        .when('/generateForMobile', {
            controller: 'GenerateForMobileController',
            templateUrl: 'views/generateTest/generateForMobile.html'
        })
        .when('/generateTestcaseAutoForWeb', {
            controller: 'GenerateTestcaseAutoForWebController',
            templateUrl: 'views/generateTest/generateTestcaseAutoForWeb.html'
        })
        .when('/generateTestcaseAutoForMobile', {
            controller: 'GenerateTestcaseAutoForMobileController',
            templateUrl: 'views/generateTest/generateTestcaseAutoForMobile.html'
        })
        .when('/generateTestcaseManuallyForWeb', {
            controller: 'GenerateTestcaseManuallyForWebController',
            templateUrl: 'views/generateTest/generateTestcaseManuallyForWeb.html'
        })
        .when('/CreateNameForManualTestcase', {
            controller: 'CreateNameForManualTestcaseController',
            templateUrl: 'views/generateTest/createNameForManualTestcase.html'
        })
        .when('/CreateNameForManualTestcaseForWeb', {
            controller: 'CreateNameForManualTestcaseForWebController',
            templateUrl: 'views/generateTest/createNameForManualTestcaseForWeb.html'
        })
        .when('/generateTestcaseManuallyForWeb/:testcaseName', {
            controller: 'GenerateTestcaseManuallyForWebController',
            templateUrl: 'views/generateTest/generateTestcaseManuallyForWeb.html'
        })
        .when('/generateTestcaseManuallyForMobile/:testcaseName', {
            controller: 'GenerateTestcaseManuallyForMobileController',
            templateUrl: 'views/generateTest/generateTestcaseManuallyForMobile.html'
        })
        .when('/generateTestcaseForWeb', {
            controller: 'TestcaseWebController',
            templateUrl: 'views/generateTest/generateTestcaseForWeb.html'
        })
        .when('/generateTestcaseForMobile', {
            controller: 'TestcaseMobileController',
            templateUrl: 'views/generateTest/generateTestcaseForMobile.html'
        })
        .when('/run/Web', {
            controller: 'RunForWebController',
            templateUrl: 'views/run/runForWeb.html'
        })
        .when('/run/Mobile', {
            controller: 'RunForMobileController',
            templateUrl: 'views/run/runForMobile.html'
        })
        .when('/report', {
            controller: 'ReportController',
            templateUrl: 'views/report/report.html'
        })
        .when('/reportForWeb', {
            controller: 'ReportForWebController',
            templateUrl: 'views/report/report_web.html'
        })
        .when('/reportForMobile', {
            controller: 'ReportForMobileController',
            templateUrl: 'views/report/report_mobile.html'
        })
        .when('/viewScreenshot/:imagePath*', {
            controller: 'ScreenshotController',
            templateUrl: 'views/report/screenshot.html'
        })
        .when('/inProgress', {
            templateUrl: 'views/inProgress.html'
        })
  .otherwise({
    redirectTo: '/'
  });
});
