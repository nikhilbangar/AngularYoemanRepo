"use strict";

var qaApp = angular.module("qaApp");

qaApp.controller("ScreenshotController", ["$scope", "$routeParams", "$sce",
  "JDPAFactory",
    function ($scope, $routeParams, $sce, JDPAFactory) {
        var urlArray = $routeParams.imagePath.split(",");

        if (urlArray.length == 3) {
            if (urlArray[1] != "" && urlArray[2] != "") {
                $scope.isTwoImageUrl = true;
                $scope.actualImageSrc = $sce.trustAsResourceUrl(urlArray[1].trim()); // actualImageUrl
                $scope.expectedImageSrc = $sce.trustAsResourceUrl(urlArray[2].trim()); // expectedImageUrl
            } else {
                $scope.isTwoImageUrl = false;
                $scope.actualImageSrc = $sce.trustAsResourceUrl(urlArray[0].trim()); // ImageUrl
            }

        } else {
            $scope.isTwoImageUrl = false;
            $scope.actualImageSrc = $sce.trustAsResourceUrl(urlArray[0].trim());
        }

  }]);