

(function() {
    var core = bloom.ns('core'),
        array = bloom.ns('utilities.array');

    core.Layer = function(opts) {
        this.actors = [];
        this.updatable = [];
        this.scene = null;
        this.dummy = null;
        this.element = null;
        this.id = opts && opts.hasOwnProperty('id') ? opts.id : null;
    };

    core.Layer.prototype.getElement = function() {
        return this.element;
    };
    core.Layer.prototype.play = function() {
        array.apply(this.actors, 'play');
    };

    core.Layer.prototype.pause = function() {
        array.apply(this.actors, 'pause');
    };

    core.Layer.prototype.add = function(actor) {
        if (actor instanceof core.Component) {
            this.addComponent(actor);
            return;
        }

        this.actors.push(actor);
        actor.layer = this;

        if (typeof actor.update === 'function') {
            this.updatable.push(actor);
        }
        if (typeof actor.start === 'function') {
            actor.start();
        }
    };
    core.Layer.prototype.update = function(time, delta) {
        var us = this.updatable,
            i,
            l = us.length;

        for (i = 0; i < l; i += 1) {
            us[i].update(time, delta);
        };
    };
    core.Layer.prototype.remove = function(actor) {
        if (actor instanceof core.Component) {
            this.removeComponent(actor);
            return;
        }

        var os = this.actors,
            us = this.updatable,
            i;

        if (typeof actor.end === 'function') {
            actor.end();
        }

        this.unregisterComponentOf(actor);

        actor.layer = null;

        i = os.indexOf(actor);
        if (i > -1) {
            os.splice(i, 1);
        }

        i = us.indexOf(actor);
        if (i > -1) {
            us.splice(i, 1);
        }
    };

    core.Layer.prototype.addComponent = function(component) {
        if (!this.dummy) {
            this.dummy = new core.Actor();
            this.add(this.dummy);
        }
        this.dummy.add(component);
    };
    core.Layer.prototype.removeComponent = function(component) {
        if (!!this.dummy) {
            this.dummy.remove(component);
        }
    };

    core.Layer.prototype.registerComponent = function(component) {
        this.attachComponent(component);
        if (typeof component.start === 'function') {
            component.start();
        }
        if (typeof component.update === 'function') {
            this.updatable.push(component);
        }
    };
    core.Layer.prototype.unregisterComponentOf = function(actor) {
        var ccs = actor.components, i, l = ccs.length;
        for (i = 0; i < l; i += 1) {
            this.unregisterComponent(ccs[i]);
        }
    };
    core.Layer.prototype.unregisterComponent = function(component) {
        var us = this.updatable,
            i;

        if (typeof component.end === 'function') {
            component.end();
        }

        this.detachComponent(component);

        if (typeof component.update === 'function') {
            i = us.indexOf(component);
            if (i > -1) {
                us.splice(i, 1);
            }
        }
    };
    core.Layer.prototype.attachComponent = function(component) {};
    core.Layer.prototype.detachComponent = function(component) {};

}());
