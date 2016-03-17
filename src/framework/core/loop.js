
(function() {
    var loop = bloom.ns('core.loop'),
        debug = bloom.ns('core.debug'),
        core = bloom.ns('core');

    loop.animate = function(time) {
        requestAnimationFrame(loop.animate);
        var is = core.instances, i, l = is.length;
        for (i = 0; i < l; i += 1) {
            is[i].update(time);
        }
    }

    loop.animate(0);
}());
