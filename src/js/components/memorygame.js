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

  this.level = 1;

  this.newGame = function (booster) {
    booster = booster || 0;

    switch (this.level) {
      case 3:
        return Game({
          cards: level3,
          limit: 10 + booster,
          cardFront: 'card-front-3.png'
        }, timeout, interval);
      case 2:
        return Game({
          cards: level2,
          limit: 20 + booster,
          cardFront: 'card-front-2.png'
        }, timeout, interval);
      default:
        return Game({
          cards: level1,
          limit: 30 + booster,
          cardFront: 'card-front-1.png'
        }, timeout, interval);
    }
  }
}

function Game(options, timeout, interval) {
  var timer,
    begin,
    timer,
    critical = 5,
    limit = options.limit,
    limitMs = limit * 1000,
    noop = function () {},
    game = {};

  game.cardFront = options.cardFront;
  mprogress.start();
  mprogress.set(.99999);

  game.deck = shuffle(options.cards.concat(options.cards))
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
    mprogress.set(1);
    mprogress.end();
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

var app = angular.module('memory-game', []);

app.controller("CardController", function($scope, $timeout, $interval) {
  var memoryGame = new MemoryGame($timeout, $interval);

  $scope.user = {};

  $scope.newGame = function (booster) {
    $scope.game = memoryGame.newGame(booster);
  };

  $scope.level = function () {
    return memoryGame.level;
  };

  $scope.playNextLevel = function () {
    memoryGame.level += 1;
    $scope.game = memoryGame.newGame();
  };
}); 


