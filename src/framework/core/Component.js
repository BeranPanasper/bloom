

(function() {
    var core = bloom.ns('core');

    core.Component = function() {

    };
    core.Component.prototype.actor = null;
    core.Component.prototype.state = null;
    core.Component.prototype.getLayer = function() {
        if (this.actor) {
            return this.actor.layer;
        }
        return null;
    };
    core.Component.prototype.getComponent = function(constructor) {
        if (this.actor) {
            return this.actor.getComponent(constructor);
        }
        return null;
    };
}());
