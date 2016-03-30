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
    tween.Tween.prototype.elapsed = 0;
    tween.Tween.prototype.duration = 1000;
    tween.Tween.prototype.onEnd = null;
    tween.Tween.prototype.onUpdate = null;
    tween.Tween.prototype.init = function (opts) {
        if (opts.hasOwnProperty('delay') && opts.delay !== undefined) {
            this.delay = opts.delay;
        } else {
            this.delay = 0;
        }
        if (opts.hasOwnProperty('duration') && opts.duration !== undefined) {
            this.duration = opts.duration;
        } else {
            this.duration = 1000;
        }
        if (opts.hasOwnProperty('easing') && opts.easing !== undefined) {
            this.easing = opts.easing;
        } else {
            this.easing = easing.Linear.None;
        }
        if (opts.hasOwnProperty('interpolation') && opts.interpolation !== undefined) {
            this.interpolation = opts.interpolation;
        } else {
            this.interpolation = interpolation.Linear;
        }
        if (opts.hasOwnProperty('onUpdate') && opts.onUpdate !== undefined) {
            this.onUpdate = opts.onUpdate;
        } else {
            this.onUpdate = null;
        }
        if (opts.hasOwnProperty('onEnd') && opts.onEnd !== undefined) {
            this.onEnd = opts.onEnd;
        } else {
            this.onEnd = null;
        }

        if (opts.hasOwnProperty('startValues') && opts.startValues !== undefined) {
            this.startValues = opts.startValues;
        } else if (opts.hasOwnProperty('from') && opts.from !== undefined) {
            this.startValues = opts.from;
        } else {
            this.startValues = {};
        }

        if (opts.hasOwnProperty('endValues') && opts.endValues !== undefined) {
            this.endValues = opts.endValues;
        } else if (opts.hasOwnProperty('to') && opts.to !== undefined) {
            this.endValues = opts.to;
        } else {
            this.endValues = {};
        }

        this.elapsed = 0;
        this.result = {};
        this.update(0, 0, true);
    };

    tween.Tween.prototype.update = function (time, delta, force) {
        var starters = this.startValues,
            enders = this.endValues,
            object = this.result,
            elapsed = this.elapsed,
            duration = this.duration,
            delay = this.delay,
            ended = false,
            start,
            end,
            value,
            property,
            cb = this.onUpdate;

        if (!force && this.delay > 0) {
            this.delay -= delta;
            if (this.delay > 0) {
                return true;
            }
        }

        elapsed += delta;
        if (elapsed >= duration) {
            elapsed = duration;
            ended = true;
        }
        this.elapsed = elapsed;

        value = this.easing(elapsed / this.duration);
        for (property in starters) {
            if (starters.hasOwnProperty(property)) {
                start = starters[property];
                end = enders[property];
                object[property] = start + (end - start) * value;
            }
        }

        if (typeof cb === 'function') {
            cb(object, elapsed);
        }

        if (ended) {
            cb = this.onEnd;
            if (typeof cb === 'function') {
                cb(object, elapsed);
            }

            return false;
        }

        return true;
    };


}());