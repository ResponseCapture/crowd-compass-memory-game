'use strict';

module.exports = function ($window) {
  return function (callback) {
    var FB = $window.FB;
    return function() {
      FB.login(function(response) {
        if (response && !response.error) {
          FB.api('/me?fields=id,first_name,last_name,email', function (user) {
            if (user && !user.error) {
              callback({
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                picture: 'https://graph.facebook.com/' + user.id + '/picture?width=350'
              });
            }
          });
        }
      }, {scope: 'email'});
    };
  };
};