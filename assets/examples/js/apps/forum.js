/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
(function(document, window, $) {
  'use strict';

  window.AppForum = App.extend({
    run: function(next) {
      next();
    }
  });

  $(document).ready(function() {
    AppForum.run();
  });
})(document, window, jQuery);
