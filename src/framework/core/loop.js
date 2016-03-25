/*global bloom, requestAnimationFrame*/
(function () {
    'use strict';

    var loop = bloom.ns('core.loop'),
        debug = bloom.ns('core.debug'),
        core = bloom.ns('core'),

        instances = core.instances,
        i,
        l;

    loop.animate = function (time) {
        requestAnimationFrame(loop.animate);
        for (i = 0, l = instances.length; i < l; i += 1) {
            instances[i].update(time);
        }
    };

    loop.animate(0);
}());
