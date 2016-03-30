/*global bloom*/
(function () {
    'use strict';

    var tween = bloom.ns('tween'),
        easing = bloom.ns('tween.easing'),
        interpolation = bloom.ns('tween.interpolation'),
        core = bloom.ns('core');

    tween.Tween = function (opts) {
        if (!!opts) {
            this.init(opts);
        }
    };

    tween.Tween.prototype.delay = 0;
    tween.Tween.prototype.delay = 1000;
    tween.Tween.prototype.init = function (opts) {
        if (opts.hasOwnProperty('delay')) {
            this.delay = opts.delay;
        } else {
            this.delay = 0;
        }
        if (opts.hasOwnProperty('duration')) {
            this.duration = opts.duration;
        } else {
            this.duration = 1000;
        }
        if (opts.hasOwnProperty('easing')) {
            this.easing = opts.easing;
        } else {
            this.easing = easing.Linear.None;
        }
        if (opts.hasOwnProperty('interpolation')) {
            this.interpolation = opts.interpolation;
        } else {
            this.interpolation = interpolation.Linear;
        }
        this.elapsed = 0;
        this.result = {};
    };

    tween.Tween.prototype.update = function (time, delta) {
        var starters = this.startValues,
            enders = this.endValues,
            object = this.result,
            elapsed,
            start,
            end,
            value,
            property;

        this.elapsed += delta;
        value = this.easing(elapsed / this.duration);

        for (property in starters) {
            if (starters.hasOwnProperty(property)) {
                start = starters[property];
                end = enders[property];
                object[property] = start + (end - start) * value;
            }
        }
    };


}());