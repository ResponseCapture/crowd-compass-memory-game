/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("masonry", {
  mode: "init",
  defaults: {
    itemSelector: ".masonry-item"
  },
  init: function(context) {
    if (typeof $.fn.masonry === "undefined") return;
    var defaults = $.components.getDefaults('masonry');

    var callback = function() {
      $('[data-plugin="masonry"]', context).each(function() {
        var $this = $(this),
          options = $.extend(true, {}, defaults, $this.data());

        $this.masonry(options);
      });
    }
    if (context !== document) {
      callback();
    } else {
      $(window).on('load', function() {
        callback();
      });
    }
  }
});
