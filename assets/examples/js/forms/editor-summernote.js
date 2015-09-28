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
  });

  window.edit = function() {
    $('.click2edit').summernote({
      focus: true
    });
  };
  window.save = function() {
    $('.click2edit').destroy();
  };
})(document, window, jQuery);
