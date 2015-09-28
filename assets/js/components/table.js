/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("table", {
  mode: "api",
  api: function(context) {
    /* section */
    $(document).on('click', '.table-section', function(e) {
      if ("checkbox" !== e.target.type && "button" !== e.target.type && "a" !== e.target.tagName.toLowerCase() && !$(e.target).parent("div.checkbox-custom").length) {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active")
        } else {
          $(this).siblings('.table-section').removeClass("active");
          $(this).addClass("active");
        }
      }
    });
  }
});
