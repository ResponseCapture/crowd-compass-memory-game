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

var level2 = [
  'L1-placer',
  'L1-woman-docs',
  'L2-app-icons',
  'L2-boxing',
  'L2-crowd',
  'L2-decisions'
];

var level3 = [
  'L1-placer',
  'L3-jumping-guy',
  'L3-party-girl',
  'L3-sleeping-woman',
  'L3-super-woman',
  'L3-tired-guy'
];

function MemoryGame(timeout, interval) {
  var games = [];

  this.newGame = function (booster, level) {
    booster = booster || 0;

    switch (level) {
      case 2: return Game(level2, 20 + booster, timeout, interval);
      case 3: return Game(level3, 10 + booster, timeout, interval);
      default: return Game(level1, 30 + booster, timeout, interval);
    }
  }
}

function Game(cards, limit, timeout, interval) {
  var timer,
    begin,
    timer,
    critical = 5,
    limitMs = limit * 1000,
    noop = function () {},
    game = {};

  game.deck = shuffle(cards.concat(cards))
    .map(function(picture) {
      return {
        item: picture,
        isFaceUp: false
      };
    });

  var checkNext;
  var check = function(card) {
    if (card.isFaceUp) return;
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

  var start = function () {
    game.check = check;
    begin = new Date();
    mprogress.start();

    timer = interval(function () {
      var elapsed = game.elapsedMs() / 1000,
        remaining = game.remaining();

      game.isCritical = Math.floor(remaining / 1000) <= critical;
      mprogress.set((remaining || 0) / limitMs);

      if (elapsed >= limit) {
        stop();
      }
    }, 50);
  };

  var stop = function () {
    interval.cancel(timer);
    game.check = noop;
    var end = new Date() - begin;
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
    if (begin) {
      var elapsed = game.elapsedMs();
      return elapsed < limitMs ? limitMs - elapsed : 0;
    } else {
      return limitMs;
    }
  }

  game.check = function (card) {
    start();
    check(card);
  };

  return game;
}

var app = angular.module('cards', []);

app.controller("CardController", function($scope, $timeout, $interval) {
  var memoryGame = new MemoryGame($timeout, $interval);

  $scope.newGame = function (booster) {
    $scope.game = memoryGame.newGame(booster);
  };

  $scope.playLevel = function (level) {
    $scope.game = memoryGame.newGame(null, level);
  };
}); 


