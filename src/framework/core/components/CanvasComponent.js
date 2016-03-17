

(function() {
    var components = bloom.ns('core.components'),
        core = bloom.ns('core');

    components.CanvasComponent = function() {
        core.Component.call(this);
    };
    bloom.inherits(components.CanvasComponent, core.Component);

    components.CanvasComponent.prototype.requireRedraw = function() {
        var a = this.actor, l;
        if (!a) {
            return;
        }
        l = a.layer;
        if (!l) {
            return;
        }
        l.requireRedraw(this);
    };
    components.CanvasComponent.prototype.clear = function(x, y, w, h) {
        var l;
        if (this.actor) {
            l = this.actor.layer;
            l.clear.apply(l, arguments);
        }
    };
}());
