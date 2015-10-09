/*!
 * crowd-compass-memory-game v1.0.0 (https://github.com/ResponseCapture/crowd-compass-memory-game#readme)
 * Copyright 2015 
 * Licensed under the ISC
 */
module.exports = function ($) {
    'use strict';

    // CLASS DEFINITION
    // ======================
    var HDisplay = function (element, options) {
        this.$element = $(element);
        this.$children = this.$element.children();
        this.options = $.extend({}, HDisplay.DEFAULTS, options);
        this._time = HDisplay.TRANSITION_DURATION * this.options.speed;

        this.init();
    };

    HDisplay.VERSION = '1.0.1';

    HDisplay.TRANSITION_DURATION = 300;

    HDisplay.DEFAULTS = {
        action: 'show',
        speed: 3,
        animationIn: 'zoomIn',
        animationOut: 'zoomOut'
    };

    HDisplay.prototype.init = function () {
        var self = this;
        var parentElement = this.$element;
        var children = this.$children;
        var options = this.options;
        var time = this._time;
        var elementOffset, calculatedOffset, elemDelay;

        parentElement.addClass('zmd-hierarchical-display');

        children.each(function () {
            elementOffset = $(this).position();
            calculatedOffset = elementOffset.left * 0.8 + elementOffset.top;
            elemDelay = parseFloat(calculatedOffset / time).toFixed(2);
            $(this)
                .css('-webkit-animation-delay', elemDelay + 's')
                .css('animation-delay', elemDelay + 's');
        });

        this._delay = elemDelay;

        // Call complete function after animation on last children element ends
        children.last().on('webkitAnimationEnd animationend', function(){
            if ($(this).hasClass(options.animationOut)) {self._complete('hidden');}
            if ($(this).hasClass(options.animationIn))  {self._complete('shown');}
        });
    };

    HDisplay.prototype.show = function () {
        var parentElement = this.$element;
        var options = this.options;

        if (parentElement.hasClass('in') || parentElement.hasClass('zmd-hierarchical-displaying')) return;

        this._removeAnimations();

        parentElement.trigger($.Event('show.zmd.hierarchicalDisplay'));

        this._addAnimation(options.animationIn);
    };

    HDisplay.prototype._removeAnimations = function () {
        var options = this.options;
        this.$children.each(function () {
            $(this)
                .removeClass(options.animationIn)
                .removeClass(options.animationOut);
        });
    };

    HDisplay.prototype._addAnimation = function (animation) {
        this.$element.addClass('zmd-hierarchical-displaying');
        this.$children.each(function () {
            $(this)
                .addClass(animation)
                .addClass('animated');
        });
    };

    HDisplay.prototype._complete = function (eventName) {
        this.$element
            .removeClass('zmd-hierarchical-displaying')
            .toggleClass('in')
            .trigger($.Event(eventName+'.zmd.hierarchicalDisplay'));
    };

    // PLUGIN DEFINITION
    // =======================
    function Plugin(settings) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('zmd.hierarchicalDisplay');
            var options = $.extend({}, HDisplay.DEFAULTS, $this.data(), typeof settings === 'object' && settings);

            if (!data) {$this.data('zmd.hierarchicalDisplay', (data = new HDisplay(this, options)));}
            if (typeof settings === 'string') {return data[settings]();}
            if (options.action in data) {return data[options.action]();}
        });
    }

    $.fn.hierarchicalDisplay = Plugin;
    $.fn.hierarchicalDisplay.Constructor = HDisplay;
};