'use strict';

module.exports = function ($window) {
  var cb;
  $window.onLinkedInLoad = function () {
    var IN = $window.IN;
    IN.Event.on(IN, 'auth', function () {
      IN.API.Profile('me')
        .fields('firstName', 'lastName', 'picture-urls::(original)', 'email-address')
        .result(function (data) {
          var user = data.values[0] || {};
          cb({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddress,
            picture: user.pictureUrls.values[0]
          });
        });
    });
  };

  return function (callback) {
    cb = callback;
    return function () {
      $window.IN.User.authorize();
    };
  };
};
