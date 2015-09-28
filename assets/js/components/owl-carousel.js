/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
$.components.register("owlCarousel", {
  mode: "default",
  defaults: {
    loop: true,
    nav: true,
    dots: false,
    dotsClass: "owl-dots owl-dots-fall",
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      }
    }
  }
});
