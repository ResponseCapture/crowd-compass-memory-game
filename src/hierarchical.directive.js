'use strict';


require('./hierarchical')(require('jquery'));

module.exports = function () {
  return {
    restrict: 'AC',
    link: function (scope, element) {
      scope.$watch(element.children(), function () {
        element.hierarchicalDisplay();
      });
    }
  };
};