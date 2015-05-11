'use strict';

/**
 * @ngdoc function
 * @name qaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the qaApp
 */
angular.module('qaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
