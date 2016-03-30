/*global bloom, requestAnimationFrame*/
(function () {
    'use strict';

    var loop = bloom.ns('core.loop'),
        debug = bloom.ns('core.debug'),
        tween = bloom.ns('tween'),
        core = bloom.ns('core'),

        instances = core.instances,
        i,
        l,

        delta,
        ts = 0,
        tweener;

    loop.animate = function (time) {

        requestAnimationFrame(loop.animate);

        delta = time - ts;
        ts = time;

        for (i = 0, l = instances.length; i < l; i += 1) {
            instances[i].update(ts);
        }

        if (!tweener) {
            tweener = tween.tweener;
        } else {
            tweener.update(ts, delta);
        }
    };

    loop.animate(0);
}());
