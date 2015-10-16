'use strict';

var MProgress = require('./mprogress'),
  shuffle = require('./shuffle');

function MemoryGame(timeout, interval, gameEndCb) {
  var user = {}, cardCount = 18;

  this.level = 1;

  function getCards(level) {
    var startingAt = ((level - 1) * 6),
      emptyCards = Array.apply(null, Array(cardCount));
    return emptyCards.map(function (_, i) {
      return ((i / (cardCount - 1)) * 100) + '% 0';
    }).slice(startingAt, startingAt + 6);
  }

  this.addUser = function (enteredUser) {
    user = enteredUser;
  };

  this.newGame = function (booster) {
    booster = booster || 0;
    var levelTimes = [35, 20, 10];

    return Game({
      cards: getCards(this.level),
      picture: user.picture,
      limit: levelTimes[this.level - 1] + booster,
      cardFront: 'card-front-' + this.level + '.png',
      gameEndCb: gameEndCb
    }, timeout, interval);
  };
}

var mprogress = new MProgress({
  parent: '#progress',
  trickle: false,
  minimum: 0
});

function Game(options, timeout, interval) {
  var timer,
    begin,
    critical = 5,
    limit = options.limit,
    limitMs = limit * 1000,
    noop = function () {},
    gameEndCb = options.gameEndCb || noop,
    profileCard = {
      picture: 'url(' + options.picture + ')',
      position: '0% 0'
    },
    game = {};

  game.cardFront = options.cardFront;
  mprogress.start();
  mprogress.set(.99999);

  var deck = options.cards.map(function (position, index) {
    return {
      position: position,
      index: index
    };
  });

  game.deck = shuffle(deck.concat(deck).map(function (card) {
    return {
      item: options.picture && card.index === 0 ? profileCard : card,
      isFaceUp: false
    };
  }));

  var checkNext;
  var check = function (card) {
    if (card.isFaceUp) return;
    if (checkNext) {
      checkNext(card);
    } else {
      card.isFaceUp = true;
      checkNext = function (nextCard) {
        nextCard.isFaceUp = true;
        if (nextCard.item === card.item) {
          nextCard.celebrate = card.celebrate = true;
          timeout(function () {
            nextCard.celebrate = card.celebrate = false;
          }, 2000);
          checkNext = void 0;
        } else {
          timeout(function () {
            nextCard.isFaceUp = card.isFaceUp = false;
            checkNext = void 0;
          }, 250);
        }

        if (game.deck.every(function (c) {
            return c.isFaceUp;
          })) {
          stop();
        }
      };
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
    gameEndCb();
    var end = new Date() - begin;
    var faceDown = game.deck
      .filter(function (c) {
        return !c.isFaceUp;
      }).length;

    timeout(function () {
      game.results = {
        time: Math.ceil(end / 1000),
        total: game.deck.length / 2,
        missing: Math.ceil(faceDown / 2)
      };
    }, 1500);
  };

  game.elapsedMs = function () {
    return new Date() - begin;
  };

  game.remaining = function () {
    if (begin) {
      var elapsed = game.elapsedMs();
      return elapsed < limitMs ? limitMs - elapsed : 0;
    } else {
      return limitMs;
    }
  };

  game.check = function (card) {
    start();
    check(card);
  };

  return game;
}

module.exports = MemoryGame;