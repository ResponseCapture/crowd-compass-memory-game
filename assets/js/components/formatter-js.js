/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("formatter", {
  mode: "init",
  defaults: {
    persistent: true
  },

  init: function(context) {
    if (!$.fn.formatter) return;

    var defaults = $.components.getDefaults("formatter"),
      browserName = navigator.userAgent.toLowerCase(),
      ieOptions;

    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
      ieOptions = {
        persistent: false
      };
    } else {
      ieOptions = {};
    }

    $('[data-plugin="formatter"]', context).each(function() {

      var options = $.extend({}, defaults, ieOptions, $(this).data());
      if (options.pattern) {
        options.pattern = options.pattern.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
      }
      $(this).formatter(options);
    });
  }
});
