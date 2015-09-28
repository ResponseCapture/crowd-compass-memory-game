/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("toolbar", {
  mode: "init",
  init: function(context) {
    if (!$.fn.toolbar) return;

    var defaults = $.components.getDefaults("toolbar");

    $('[data-plugin="toolbar"]', context).each(function() {
      var $this = $(this);
      var content = $this.data("toolbar");

      var options = $.extend(true, {}, defaults);

      if (content) {
        options.content = content;
      }

      $this.toolbar(options);
    });
  }
});
