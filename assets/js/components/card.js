/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("card", {
  mode: "init",
  defaults: {

  },
  init: function(context) {
    if (!$.fn.card) return;
    var defaults = $.components.getDefaults("card");

    $('[data-plugin="card"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      if (options.target) {
        options.container = $(options.target);
      }
      $(this).card(options);
    });
  }
});
