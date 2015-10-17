'use strict';

window.jQuery = window.$ = require('jquery');
window.responseCapture = (window.responseCapture || {
  updateUser: function (data) {
    window.console.log('called updateUser with', data);
  }
});

var angular = require('angular'),
  hierarchical = require('./src/hierarchical.directive'),
  minHeight = require('./src/minHeight.directive'),
  MemoryGame = require('./src/memorygame'),
  appHtml = require('raw!./src/app.html'),
  boxSvg = require('./assets/images/box.svg'),
  titleSvg = require('./assets/images/title.svg'),
  loginSvg = require('./assets/images/homepage-button.svg'),
  facebookSvg = require('./assets/images/facebook.svg'),
  linkedinSvg = require('./assets/images/linkedin.svg'),
  template = require('./src/template.directive');

require('./index.scss');
var facebook = require('./src/facebook')(window);
var linkedin = require('./src/linkedin')(window);

angular.module('memory-game', [])
  .directive('appcontent', template(appHtml))
  .directive('boxSvg', template(boxSvg))
  .directive('titleSvg', template(titleSvg))
  .directive('loginSvg', template(loginSvg))
  .directive('facebookSvg', template(facebookSvg))
  .directive('linkedinSvg', template(linkedinSvg))
  .directive('minHeight', ['$window', minHeight])
  .directive('hierarchical', hierarchical)
  .controller('CardController', ['$scope', '$timeout', '$interval',
    function ($scope, $timeout, $interval) {
      function gameEnd() {
        $scope.resultsLoading = true;
        $timeout(function () {
          $scope.resultsLoading = false;
        }, 2000);
      }

      var memoryGame = new MemoryGame($timeout, $interval, gameEnd),
        availableLevels = {
          1: true
        };

      $scope.intro = {};

      $scope.updateUser = function(user) {
        if (user) {
          $scope.user = user;
          memoryGame.addUser(user);
          $timeout(function () {
            $scope.$digest();
          });
        }
      };

      $scope.social = {
        linkedin: linkedin($scope.updateUser),
        facebook: facebook($scope.updateUser)
      };

      function newGame(booster) {
        $scope.gameLoading = true;
        $scope.showIntro = false;
        $timeout(function () {
          $scope.gameLoading = false;
          $timeout(function() {
            $scope.showIntro = true;
          }, 250);
        }, 100);
        return memoryGame.newGame(booster);
      }
      
      $scope.newGameIfNotStarted = function () {
        $scope.game = ($scope.game || newGame());
      };

      $scope.newGame = function (booster) {
        $scope.game = newGame(booster);
      };

      $scope.currentLevel = function () {
        return memoryGame.level;
      };

      $scope.levelIsAvailable = function (level) {
        return !!availableLevels[level];
      };

      $scope.playLevel = function (level) {
        $scope.menuOpen = false;
        availableLevels[level] = true;
        memoryGame.level = level;
        $scope.game = newGame();
      };
    }]);
