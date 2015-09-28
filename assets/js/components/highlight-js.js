/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("highlight", {
  mode: "init",
  defaults: {

  },
  init: function(context) {
    if (typeof $.fn.hightlight === "undefined") return;
    var defaults = $.components.getDefaults('highlight');

    // hljs.configure({useBR: true});

    $('[data-plugin="highlight"]', context).each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }
});
