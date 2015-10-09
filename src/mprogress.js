'use strict';

var Utils = {
  extend: function (newObj, targetObj) {
    targetObj = JSON.parse(JSON.stringify(targetObj));
    if (typeof newObj === 'string') {
      return targetObj;
    }

    var key, value;
    for (key in newObj) {
      value = newObj[key];
      if (newObj.hasOwnProperty(key) && value !== undefined) {
        targetObj[key] = value;
      }
    }

    return targetObj;
  },

  /**
   * Queues a function to be executed.
   */

  queue: (function () {
    var pending = [];

    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function (fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })(),

  /**
   * Applies css properties to an element, similar to the jQuery 
   * setcss method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */
  setcss: (function () {
    var cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'],
      cssProps = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function (match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
        capName = name.charAt(0).toUpperCase() + name.slice(1),
        vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function (element, properties) {
      var args = arguments,
        prop,
        value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    };
  })(),

  clamp: function (n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  },

  /**
   * converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */
  toBarPerc: function (n) {
    return (-1 + n) * 100;
  },

  hasClass: function (element, name) {
    var list = typeof element == 'string' ? element : Utils.classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  },

  addClass: function (element, name) {
    var oldList = Utils.classList(element),
      newList = oldList + name;

    if (Utils.hasClass(oldList, name)) return;

    // Trim the opening space.
    element.className = newList.substring(1);
  },

  removeClass: function (element, name) {
    var oldList = Utils.classList(element),
      newList;

    if (!Utils.hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  },

  showEl: function (element) {
    Utils.setcss(element, {
      display: 'block'
    });
  },

  hideEl: function (element) {
    Utils.setcss(element, {
      display: 'none'
    });
  },

  classList: function (element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  },

  /**
   * Removes an element from the DOM.
   */
  removeElement: function (element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }
};

var renderTemplate = '<div class="deter-bar" role="mpbar1">' +
    '<div class="peg"></div>' +
    '</div>' +
    '<div class="bar-bg"></div>';

var cacheStore = {};

var MProgress = function (options) {
  this.options = options || {};
  this.status = null; //Last number
};

MProgress.prototype = {

  version: '0.1.0',

  constructor: MProgress,

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     MProgress.start();
   *
   */
  start: function () {
    return this;
  },

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `end()` makes some placebo effect of some realistic motion.
   *
   *     MProgress.end();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     MProgress.end(true);
   */
  end: function (force) {
    if (!force && !this.status) return this;
    return this.inc(0.3 + 0.5 * Math.random()).set(1);
  },

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     MProgress.set(0.4);
   *     MProgress.set(1.0);
   */
  set: function (n) {
    n = Utils.clamp(n, this.options.minimum, 1);
    this.status = (n === 1 ? null : n);

    this._setProgress(this._getCurrSelector(), n);

    return this;
  },

  /**
   * Increments by a random amount.
   */
  inc: function (amount) {
    var n = this.status;

    if (!n) {
      return this.start();
    } else {
      n = this._getRandomNum(n, amount);
      return this.set(n);
    }
  },

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * 
   */
  _render: function () {
    if (this._isRendered()) {
      return this._getRenderedId();
    }

    var progress = document.createElement('div');
    var MParent = document.querySelector(this.options.parent);

    progress.id = this._getRenderedId(true);
    progress.className = 'ui-mprogress';
    progress.innerHTML = renderTemplate || '';

    if (MParent != document.body) {
      Utils.addClass(MParent, 'mprogress-custom-parent');
    }

    MParent.appendChild(progress);
    return progress;
  },

  /**
   * Removes the element. Opposite of _render().
   */
  _remove: function () {
    var progress = this._getRenderedId(),
      MParent = document.querySelector(this.options.parent);

    if (MParent != document.body) {
      Utils.removeClass(MParent, 'mprogress-custom-parent');
    }

    // clear cache 
    var idName = this.options.parent + this.options.template;
    if (cacheStore[idName]) {
      cacheStore[idName] = null;
    }

    if (progress) {
      this.status = null;
      Utils.removeElement(progress);
    }
  },

  /**
   * interior method 
   *
   */
  _setProgress: function (barSelector, n) {
    var progress = this._render();
    var bar = progress.querySelector(barSelector);
    var speed = this.options.speed;
    var ease = this.options.easing;
    var that = this;

    progress.offsetWidth; /* Repaint */

    /**
     * indeterminate and query just has 'start' and 'end' method 
     */

    Utils.queue(function (next) {
      // Set positionUsing if it hasn't already been set
      if (that.options.positionUsing === '') that.options.positionUsing = that._getPositioningCSS();

      // Add transition
      Utils.setcss(bar, that._barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        Utils.setcss(progress, {
          transition: 'none',
          opacity: 1
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function () {
          Utils.setcss(progress, {
            transition: 'all ' + speed + 'ms linear',
            opacity: 0
          });
          setTimeout(function () {
            that._remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });


  },

  _getCurrSelector: function () {
    return '[role="mpbar1"]';
  },

  _isStarted: function () {
    return typeof this.status === 'number';
  },

  _getRandomNum: function (n, amount) {
    if (typeof amount !== 'number') {
      amount = (1 - n) * Utils.clamp(Math.random() * n, 0.1, 0.95);
    }

    n = Utils.clamp(n + amount, 0, 0.994);

    return n;
  },

  /**
   * Checks if the progress bar is rendered.
   */
  _isRendered: function () {
    return !!this._getRenderedId();
  },

  _getRenderedId: function (getId) {
    var idName = 'mprogress1';

    if (!getId) {
      return document.getElementById(idName);
    } else {
      return idName;
    }
  },


  /**
   * Determine which positioning CSS rule to use.
   */
  _getPositioningCSS: function () {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
      ('MozTransform' in bodyStyle) ? 'Moz' :
      ('msTransform' in bodyStyle) ? 'ms' :
      ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  },

  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */
  _barPositionCSS: function (n, speed, ease) {
    var barCSS;

    if (this.options.positionUsing === 'translate3d') {
      barCSS = {
        transform: 'translate3d(' + Utils.toBarPerc(n) + '%,0,0)'
      };
    } else if (this.options.positionUsing === 'translate') {
      barCSS = {
        transform: 'translate(' + Utils.toBarPerc(n) + '%,0)'
      };
    } else {
      barCSS = {
        'margin-left': Utils.toBarPerc(n) + '%'
      };
    }

    barCSS.transition = 'all ' + speed + 'ms ' + ease;

    return barCSS;
  }

};

/**
 * Waits for all supplied jQuery or Zepto promises and
 * increases the progress as the promises resolve.
 * 
 * @param $promise jQuery or Zepto Promise
 */
var initial = 0,
  current = 0;

(function () {
  MProgress.prototype.promise = function ($promise) {
    if (!$promise || $promise.state() == 'resolved') {
      return this;
    }

    var that = this;

    if (current == 0) {
      that.start();
    }

    initial++;
    current++;

    $promise.always(function () {
      current--;
      if (current == 0) {
        initial = 0;
        that.end();
      } else {
        that.set((initial - current) / initial);
      }
    });

    return this;
  };
})();


module.exports = MProgress;
