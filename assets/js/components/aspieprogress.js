/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("pieProgress", {
  mode: "init",
  defaults: {
    namespace: "pie-progress",
    speed: 30,
    classes: {
      svg: "pie-progress-svg",
      element: "pie-progress",
      number: "pie-progress-number",
      content: "pie-progress-content"
    }
  },
  init: function(context) {
    if (!$.fn.asPieProgress) return;

    var defaults = $.components.getDefaults("pieProgress");

    $('[data-plugin="pieProgress"]', context).each(function() {
      var $this = $(this),
        options = $this.data();

      options = $.extend(true, {}, defaults, options);

      $this.asPieProgress(options);
    });
  }
});
