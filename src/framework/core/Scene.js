

(function() {
    var core = bloom.ns('core'),
        array = bloom.ns('utilities.array');

    core.Scene = function(options) {
        this.id = null;
        this.game = null;
        this.layers = [];
        this.paused = false;
        if (!!options) {
            if (options.hasOwnProperty('id')) {
                this.id = options.id;
            }
        }
    };

    core.Scene.prototype.triggerPlay = function() {
        array.apply(this.layers, 'play');
        if (typeof this.play === 'function') {
            this.play();
        }
    };

    core.Scene.prototype.triggerPause = function() {
        array.apply(this.layers, 'pause');
        if (typeof this.pause === 'function') {
            this.pause();
        }
    };

    core.Scene.prototype.update = function (time, delta) {
        var ls = this.layers, i, l = ls.length;
        for (i = 0; i < l; i += 1) {
            ls[i].update(time, delta);
        }
    };
    core.Scene.prototype.add = function(layer) {
        if (!(layer instanceof core.Layer)) {
            throw new Error('Given layer must be a bloom.core.Layer instance');
        }
        layer.scene = this;
        this.layers.push(layer);
        if (typeof layer.start === 'function') {
            layer.start();
        }
    };
    core.Scene.prototype.remove = function(layer) {
        if (!(layer instanceof core.Layer)) {
            throw new Error('Given layer must be a bloom.core.Layer instance');
        }

        layer.scene = null;
        if (typeof layer.end === 'function') {
            layer.end();
        }
        var i = this.layers.indexOf(layer);
        if (i > -1) {
            this.layers.splice(i, 1);
        }
    };
    core.Scene.prototype.destroy = function() {
        this.layers = null;
    };

}());
