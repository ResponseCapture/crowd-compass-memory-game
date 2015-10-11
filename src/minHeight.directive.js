'use strict';

var $ = require('jquery');

module.exports = function ($window) {
  return {
    restrict: 'AC',
    link: {
      post: function (scope, container) {
        function resize() {
          var maxHeight = container.css('max-height').replace('px', ''),
            maxWidth = container.css('max-width').replace('px', ''),
            parent = container.parent(),
            parentHeight = parent.height(),
            parentRatio = parent.width() / parentHeight,
            ratio = container.width() / container.height();

          var width = parentHeight * ratio * .99;
          container.width(parentRatio > ratio && parentHeight < maxHeight && maxWidth > width ? width : '');
        }

        $($window).resize(resize);

        scope.$watch(container.children(), function () {
          $($window).trigger('resize');
        });
      }
    }
  };
};