/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
var mprogress = new Mprogress({
  parent: '#progress',
  trickle: false,
  minimum: 0
});

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

var level1 = [
  'L1-placer',
  'L1-clock',
  'L1-personality',
  'L1-frazzled',
  'L1-supplies',
  'L1-phones'
];

function Level(cards, limit, timeout, interval) {
  var timer,
    begin,
    timer,
    critical = 5,
    limitMs = limit * 1000,
    noop = function () {},
    level = {};

  level.deck = shuffle(cards.concat(cards))
    .map(function(picture) {
      return {
        item: picture,
        isFaceUp: false
      };
    });

  var checkNext;
  var check = function(card) {
    if (checkNext) {
      checkNext(card);
    } else {
      card.isFaceUp = true;
      checkNext = function(nextCard) {
        nextCard.isFaceUp = true;
        if (nextCard.item === card.item) {
          checkNext = void 0;
        } else {
          timeout(function() {
            nextCard.isFaceUp = card.isFaceUp = false;
            checkNext = void 0;
          }, 250);
        }

        if (level.deck.every(function (c) { 
          return c.isFaceUp; 
        })) {
          stop();
        }
      }
    }
  };

  var start = function () {
    level.check = check;
    begin = new Date();
    mprogress.start();

    timer = interval(function () {
      var elapsed = level.elapsedMs() / 1000,
        remaining = level.remaining();

      level.isCritical = Math.floor(remaining / 1000) <= critical;
      mprogress.set((remaining || 0) / limitMs);

      if (elapsed >= limit) {
        stop();
      }
    }, 50);
  };

  var stop = function () {
    interval.cancel(timer);
    level.check = noop;
    var end = new Date() - begin;
    var faceDown = level.deck
      .filter(function (c) { 
        return !c.isFaceUp; 
      }).length;

      timeout(function() {
        level.results = {
          time: Math.ceil(end / 1000),
          total: level.deck.length / 2,
          missing: Math.ceil(faceDown / 2)
        };
        mprogress.end();
      }, 1500);
  };

  level.elapsedMs = function () {
    return new Date() - begin;
  }

  level.remaining = function () {
    if (begin) {
      var elapsed = level.elapsedMs();
      return elapsed < limitMs ? limitMs - elapsed : 0;
    } else {
      return limitMs;
    }
  }

  level.check = function (card) {
    start();
    check(card);
  };

  return level;
}

function Game() {
  
}

var app = angular.module('cards', []);

app.controller("CardController", function($scope, $timeout, $interval) {
  $scope.newGame = function () {
    $scope.game = Level(level1, 30, $timeout, $interval);
  };
}); 


