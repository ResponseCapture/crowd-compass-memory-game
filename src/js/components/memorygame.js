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

function Game(cards, timeout, interval) {
  var timer,
    begin,
    timer,
    limit = 45,
    limitMs = limit * 1000, 
    game = {};

  game.deck = shuffle(cards.concat(cards))
    .map(function(picture) {
      return {
        item: picture,
        isFaceUp: false
      };
    });

  var start = function () {
    begin = new Date();
    mprogress.start();

    return interval(function () {
      var elapsed = game.elapsedMs() / 1000;

      game.isCritical = elapsed <= 5;
      mprogress.set(game.remaining() / limitMs);

      if (elapsed >= limit) {
        stop();
      }
    }, 50);
  };

  var stop = function () {
    var end = new Date() - begin;
    interval.cancel(timer);
    var faceDown = game.deck
      .filter(function (c) { 
        return !c.isFaceUp; 
      }).length;

      timeout(function() {
        game.results = {
          time: Math.ceil(end / 1000),
          total: game.deck.length / 2,
          missing: Math.ceil(faceDown / 2)
        };
        mprogress.end();
      }, 1500);
  };

  game.elapsedMs = function () {
    return new Date() - begin;
  }

  game.remaining = function () {
    if (!end && begin) {
      return limitMs - game.elapsedMs();
    }
  }

  var checkNext;
  game.check = function(card) {
    if (!timer) {
      timer = start();
    }
      
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

        if (game.deck.every(function (c) { 
          return c.isFaceUp; 
        })) {
          stop();
        }
      }
    }
  };

  return game;
}

var app = angular.module('cards', []);

app.controller("CardController", function($scope, $timeout, $interval) {
  $scope.newGame = function () {
    $scope.game = Game(level1, $timeout, $interval);
  };
}); 


