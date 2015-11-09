'use strict';

window.jQuery = window.$ = require('jquery');
var api = window.responseCapture;

var angular = require('angular'),
  hierarchical = require('./src/hierarchical.directive'),
  minHeight = require('./src/minHeight.directive'),
  MemoryGame = require('./src/memorygame'),
  appHtml = require('raw!./src/app.html'),
  shareHtml = require('raw!./src/share.html'),
  boxSvg = require('svg-inline!./src/svg/box.sv'),
  titleSvg = require('svg-inline!./src/svg/title.sv'),
  introCardBgSvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/intro-card-bg.sv'),
  levelOneBgSvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/level-1-bg.sv'),
  levelTwoBgSvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/level-2-bg.sv'),
  levelThreeBgSvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/level-3-bg.sv'),
  starPowerSvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/star-power-img.sv'),
  heartSvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/heart.sv'),
  closeSvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/close.sv'),
  toughguySvg = require('svg-inline?removeSVGTagAttrs=false!./src/svg/toughguy.sv'),
  socialSvg = require('svg-inline!./src/svg/share.sv'),
  loginSvg = require('svg-inline!./src/svg/homepage-button.sv'),
  facebookSvg = require('svg-inline!./src/svg/facebook.sv'),
  linkedinSvg = require('svg-inline!./src/svg/linkedin.sv'),
  waveBgTwoSvg = require('svg-inline!./src/svg/wave-bg-2.sv'),
  waveBgSvg = require('svg-inline!./src/svg/wave-bg.sv'),
  logoSvg = require('svg-inline!./src/svg/logo.sv'),
  template = require('./src/template.directive');

require('./index.scss');
var facebook = require('./src/facebook')(window);
var linkedin = require('./src/linkedin')(window);

angular.module('memory-game', [])
  .directive('appcontent', template(appHtml))
  .directive('shareHtml', template(shareHtml))
  .directive('boxSvg', template(boxSvg))
  .directive('titleSvg', template(titleSvg))
  .directive('loginSvg', template(loginSvg))
  .directive('facebookSvg', template(facebookSvg))
  .directive('linkedinSvg', template(linkedinSvg))
  .directive('waveBgTwoSvg', template(waveBgTwoSvg))
  .directive('waveBgSvg', template(waveBgSvg))
  .directive('logoSvg', template(logoSvg))
  .directive('introCardBgSvg', template(introCardBgSvg))
  .directive('levelOneBgSvg', template(levelOneBgSvg))
  .directive('levelTwoBgSvg', template(levelTwoBgSvg))
  .directive('levelThreeBgSvg', template(levelThreeBgSvg))
  .directive('socialSvg', template(socialSvg))
  .directive('closeSvg', template(closeSvg))
  .directive('toughguySvg', template(toughguySvg))
  .directive('heartSvg', template(heartSvg))
  .directive('starPowerSvg', template(starPowerSvg))
  .directive('minHeight', ['$window', minHeight])
  .directive('hierarchical', hierarchical)
  .controller('CardController', ['$scope', '$timeout', '$interval',
    function ($scope, $timeout, $interval) {

      function gameEnd(results) {
        $scope.resultsLoading = true;
        $timeout(function () {
          $scope.user.numberOfPlays = results.numberOfPlays;
          $scope.user.levelComplete = results.levelComplete;
          $scope.resultsLoading = false;
        }, 2000);
      }

      var memoryGame = new MemoryGame($timeout, $interval, gameEnd),
        availableLevels = {
          1: true
        };

      $scope.intro = {};

      if (window.query.level) {
        
        $scope.user = {
          firstName: 'Joe',
          lastName: 'Bob'
        };

        if ((window.query.round || 1) - 1) {
          if (window.query.level === 1) {
            $scope.user.workEmail = 'test@test.com';
          } else {
            $scope.user.companyName = 'company name';
          }
        }

        availableLevels = {
          1: true,
          2: true,
          3: true
        };
        
        memoryGame.level = window.query.level;
        $scope.game = {};
        
        $scope.game.results = {
          missing: window.query.missing || 0,
          time: 23
        };
      }

      $scope.api = api;

      $scope.updateUser = function(user) {
        if (user) {
          $scope.user = user;
          memoryGame.addUser(user);
          api.updateUser(user);
          $timeout(function () {
            $scope.$digest();
          });
        }
      };

      function createUser(user) {
        $scope.userLoading = true;
        $timeout(function () {
          $scope.$digest();
          $timeout(function () {
            $scope.updateUser(user);
            $scope.userLoading = false;
          }, 1500);
        });
      }

      $scope.$watch('user', $scope.updateUser, true);

      $scope.social = {
        linkedin: linkedin(createUser),
        facebook: facebook(createUser)
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
