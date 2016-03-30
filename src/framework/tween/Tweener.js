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

    tween.Tweener.prototype.add = function (tween) {
        this.tweens.push(tween);
    };
    tween.Tweener.prototype.remove = function (tween) {
        this.removeByIndex(this.tweens.indexOf(tween));
    };
    tween.Tweener.prototype.removeByIndex = function (index) {
        this.tweens.splice(index, 1);
    };
    tween.Tweener.prototype.update = function (time, delta) {
        var ts = this.tweens, l;
        for (l = this.tweens.length - 1; l >= 0; l -= 1) {
            if (!ts[l].update(time, delta)) {
                this.removeByIndex(l);
            }
        }
    };

    tween.tweener = new tween.Tweener();

    tween.tween = function (from, to, duration, cb, easing, delay) {
        var tt = tween.tweener,
            p = tt.pool,
            t = p.get();

        t.init({
            startValues: from,
            endValues: to,
            duration: duration,
            delay: delay,
            easing: easing,
            onUpdate: cb,
            onEnd: function () {
                p.release(t);
            }
        });

        tt.add(t);
    };

}());