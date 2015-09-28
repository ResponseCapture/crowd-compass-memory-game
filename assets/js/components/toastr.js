/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("toastr", {
  mode: "api",
  api: function() {
    if (typeof toastr === "undefined") return;
    var defaults = $.components.getDefaults("toastr");

    $(document).on('click.site.toastr', '[data-plugin="toastr"]', function(e) {
      e.preventDefault();

      var $this = $(this);
      var options = $.extend(true, {}, defaults, $this.data());
      var message = options.message || '';
      var type = options.type || "info";
      var title = options.title || undefined;

      switch (type) {
        case "success":
          toastr.success(message, title, options);
          break;
        case "warning":
          toastr.warning(message, title, options);
          break;
        case "error":
          toastr.error(message, title, options);
          break;
        case "info":
          toastr.info(message, title, options);
          break;
        default:
          toastr.info(message, title, options);
      }
    });
  }
});
