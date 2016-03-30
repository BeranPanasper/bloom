/*global bloom*/
(function () {
    'use strict';

    var tween = bloom.ns('tween'),
        utilities = bloom.ns('utilities'),
        core = bloom.ns('core');

    tween.Tweener = function () {
        this.tweens = [];
        this.pool = new utilities.Pool(tween.Tween);
    };

    tween.Tweener.prototype.update = function (time, delta) {
        var ts = this.tweens, i, l = this.tweens.length;
        for (i = 0; i < l; i += 1) {
            ts.update();
        }
    };

    tween.tweener = new tween.Tweener();


    tween.tween = function (from, to, duration, cb, easing, interpolation) {
        var p = this.pool,
            t = p.get();

        t.onUpdate = cb;
        t.onEnd = function () {
            p.release(t);
        };
    };

}());