'use strict';

module.exports = function ($window) {
  var IN;
  $window.onLinkedInLoad = function() {
    IN = $window.IN;
    IN.Event.on(IN, 'auth', function() {
      IN.API.Profile('me')
        .fields('firstName', 'lastName', 'picture-urls::(original)', 'email-address')
        .result(function(data) {
          var user = data.values[0] || {};
          $window.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddress,
            picture: user.pictureUrls.values[0]
          };
        });
    });
  };

  return function () {
    IN.User.authorize();
  };
};