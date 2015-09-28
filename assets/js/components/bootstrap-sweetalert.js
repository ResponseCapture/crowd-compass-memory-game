/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("sweetalert", {
  mode: "api",
  api: function() {
    if (typeof swal === "undefined") return;

    var defaults = $.components.getDefaults("sweetalert");

    $(document).on('click.site.sweetalert', '[data-plugin="sweetalert"]', function() {
      var options = $.extend(true, {}, defaults, $(this).data());

      swal(options);
    });
  }
});
