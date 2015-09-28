/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("breadcrumb", {
  mode: "init",
  defaults: {
    namespace: "breadcrumb"
  },
  init: function(context) {
    if (!$.fn.asBreadcrumbs) return;
    var defaults = $.components.getDefaults("breadcrumb");

    $('[data-plugin="breadcrumb"]', context).each(function() {
      var options = $.extend({}, defaults, $(this).data());

      $(this).asBreadcrumbs(options);
    });
  }
});
