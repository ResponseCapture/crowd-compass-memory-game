/* MProgress  inspire from Material Design and NProgress...
 * @license MIT */
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
  MemoryGame = require('./src/memorygame');

require('./index.scss');
var facebook = require('./src/facebook')(window);
var linkedin = require('./src/linkedin')(window);

angular.module('memory-game', [])
  .directive('minHeight', ['$window', minHeight])
  .directive('hierarchical', hierarchical)
  .controller('CardController', ['$scope', '$timeout', '$interval', '$window',
    function ($scope, $timeout, $interval, $window) {
      var memoryGame = new MemoryGame($timeout, $interval),
        availableLevels = {
          1: true
        };

      $scope.social = {
        linkedin: linkedin,
        facebook: facebook
      };

      $scope.$watch(function () {
        return $window.user;
      }, function (user) {
        $scope.user = user;
      });

      $scope.$watch('user', function (user) {
        if (user) {
          memoryGame.addUser(user);
        }
      }, true);

      $scope.menuOpen = true;
      
      $scope.newGameIfNotStarted = function () {
        $scope.game = ($scope.game || memoryGame.newGame());
      };

      $scope.newGame = function (booster) {
        $scope.game = memoryGame.newGame(booster);
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
        $scope.game = memoryGame.newGame();
      };
    }]);
