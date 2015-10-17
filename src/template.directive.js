'use strict';

module.exports = function (html) {
  return function () {
    return {
      restrict: 'AC',
      replace: true,
      template: html
    };
  };
};