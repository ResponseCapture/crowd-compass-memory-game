/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function createDeck() {
  var items = [
    'L1-placer',
    'L1-clock',
    'L1-personality',
    'L1-frazzled',
    'L1-supplies',
    'L1-phones'
  ];

  return shuffle(shuffle(items.concat(items)))
    .map(function(picture) {
      return {
        item: picture,
        isFaceUp: false
      };
    });
} 

var app = angular.module('cards', []);

app.controller("CardController", function($scope, $timeout, $interval) {
  var timer, 
    noop = function () {};

  var check = function(card) {
    if (!timer) {
      $scope.startTimer();
    }
      
    if (card.isFaceUp) {
      return;
    }

    card.isFaceUp = true;
    $scope.check = function(nextCard) {
      if (nextCard.isFaceUp) {
        return;
      }

      nextCard.isFaceUp = true;
      if (nextCard.item === card.item) {
        $scope.check = check;
      } else {
        $scope.check = noop;
        $timeout(function() {
          nextCard.isFaceUp = card.isFaceUp = false;
          $scope.check = check;
        }, 1000);
      }

      if ($scope.deck.every(function (c) { 
        return c.isFaceUp; 
      })) {
        $timeout(function() {
          $scope.stop();
        }, 1000);
      }
    }
  }

  $scope.newGame = function () {
    $scope.deck = createDeck();
    $scope.check = check;
    $scope.results = undefined;
  };

  $scope.startTimer = function() {
    $scope.timeLimit = 60000;

    timer = $interval(function () {
      $scope.timeLimit -= 1000;
      $scope.isCritical = $scope.timeLimit <= 10000 ? true : false;

      if ($scope.timeLimit === 0) {
        $scope.stop();
      }
    }, 1000);

    $scope.stop = function () {
      $scope.check = noop;
      $interval.cancel(timer);

      var faceDown = $scope.deck
        .filter(function (c) { 
          return !c.isFaceUp; 
        }).length;

      $scope.results = {
        time: $scope.timeLimit,
        total: $scope.deck.length / 2,
        missing: Math.ceil(faceDown / 2)
      };
      
      $scope.timeLimit = timer = undefined;
    }
  }
}); 


