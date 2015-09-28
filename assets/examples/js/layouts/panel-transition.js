/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();

    var $example = $('#exampleTransition');

    $(document).on('click.panel.transition', '[data-type]', function() {
      var type = $(this).data('type');

      $example.data('animateList').run(type);
    });
  });

})(document, window, jQuery);
