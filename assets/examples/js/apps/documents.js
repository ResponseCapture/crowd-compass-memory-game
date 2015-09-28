/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
(function(document, window, $) {
  'use strict';
  window.AppDocuments = App.extend({
    affixHandle: function() {
      $('#articleAffix').affix({
        offset: {
          top: 210
        }
      });
    },
    scrollHandle: function() {
      $('body').scrollspy({
        target: '#articleAffix'
      });
    },
    run: function(next) {
      this.scrollHandle();
      this.affixHandle();

      next();
    }
  });

  $(document).ready(function() {
    AppDocuments.run();
  });
})(document, window, jQuery);
