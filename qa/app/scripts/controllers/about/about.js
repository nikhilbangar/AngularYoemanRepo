'use strict';

/**
 * @ngdoc function
 * @name qaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the qaApp
 */
angular.module('qaApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
