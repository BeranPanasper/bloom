

(function() {
    var core = bloom.ns('core'),
        colors = bloom.ns('game.colors'),
        dom = bloom.require('utilities.dom');

    core.Layer2D = function() {
        core.Layer.call(this);
        this.template = null;
        this.w = 800;
        this.h = 450;
        this.element = dom.create('canvas', {
            width: this.w,
            height: this.h
        });
        this.requiredRedraw = [];
        this.clearColor = null;
    };

    bloom.inherits(core.Layer2D, core.Layer);

    core.Layer2D.prototype.start = function() {
        dom.get('#wrapper').appendChild(this.element);
    };

    core.Layer2D.prototype.update = function() {
        var i = 0, l = this.requiredRedraw.length, c;
        core.Layer.prototype.update.apply(this, arguments);
        if (l) {
            c = this.getContext();
            for (i = 0; i < l; i += 1) {
                this.requiredRedraw[i].draw(c);
            }
            this.requiredRedraw = [];
        }
    };

    core.Layer2D.prototype.clear = function(x, y, w, h) {
        if (arguments.length === 0) {
            x = 0;
            y = 0;
            w = this.w;
            h = this.h;
        }
        var c = this.getContext();
        if (!!this.clearColor) {
            c.fillStyle = this.clearColor;
            c.fillRect(x, y, w, h);
        } else {
            c.clearRect(x, y, w, h);
        }
    };

    core.Layer2D.prototype.end = function() {
        dom.get('#wrapper').removeChild(this.element);
    };

    core.Layer2D.prototype.requireRedraw = function(component) {
        this.requiredRedraw.push(component);
    };

    core.Layer2D.prototype.getCanvas = function() {
        return this.element;
    };

    core.Layer2D.prototype.getContext = function() {
        return this.element.getContext('2d');
    };

    core.Layer2D.prototype.attachComponent = function(component) {
        if (typeof component.draw === 'function') {
            component.draw(this.getContext());
        }
    };

    core.Layer2D.prototype.detachComponent = function(component) {
        if (typeof component.clear === 'function') {
            component.clear(this.getContext());
        }
    };
}());
