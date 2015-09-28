/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
(function(document, window, $) {

  $(document).ready(function() {
    Site.run();

    if ($('.list-group[data-plugin="nav-tabs"]').length) {
      $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $(e.target).addClass('active').siblings().removeClass('active');
      });
    }
  });

})(document, window, jQuery);
