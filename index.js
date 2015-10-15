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
  .controller('CardController', ['$scope', '$timeout', '$interval',
    function ($scope, $timeout, $interval) {
      var memoryGame = new MemoryGame($timeout, $interval),
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

      $scope.menuOpen = true;

      function newGame(booster) {
        $scope.gameLoading = true;
        $timeout(function () {
          $scope.showIntro = false;
          $scope.gameLoading = false;
          $timeout(function() {
            $scope.showIntro = true;
          }, 500);
        }, 1000);
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
