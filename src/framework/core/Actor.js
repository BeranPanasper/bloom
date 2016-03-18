

(function() {
    var core = bloom.ns('core'),
        array = bloom.ns('utilities.array'),
        string = bloom.ns('utilities.string');

    core.Actor = function() {
        this.components = [];
        this.layer = null;
        this.state = new core.State();
    };

    core.Actor.prototype.play = function() {
        array.apply(this.components, 'play');
    };

    core.Actor.prototype.pause = function() {
        array.apply(this.components, 'pause');
    };

    core.Actor.prototype.getGame = function() {
        return this.layer.scene.game;
    };

    core.Actor.prototype.requireRedraw = function() {
        var cs = this.components,
            i,
            l = cs.length;
        for (i = 0; i < l; i += 1) {
            if (typeof cs[i].requireRedraw === 'function') {
                cs[i].requireRedraw();
            }
        }
    };

    core.Actor.prototype.getComponent = function(constructor) {
        var cs = this.components,
            i,
            l = cs.length;
        for (i = 0; i < l; i += 1) {
            if (cs[i] instanceof constructor) {
                return cs[i];
            }
        }
        return null;
    };

    core.Actor.prototype.add = function(component) {
        if (!component) {
            throw new Error('Component is undefined');
        }
        this.components.push(component);
        component.state = this.state;
        component.actor = this;
        this.layer.registerComponent(component);
    };

    core.Actor.prototype.remove = function(component) {
        var cs = this.components,
            i = cs.indexOf(component);
        if (i > -1) {
            cs.splice(i, 1);
        }
        component.state = null;
        component.actor = null;
        this.layer.unregisterComponent(component);
    };
}());
