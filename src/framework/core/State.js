

(function() {
    var core = bloom.ns('core');

    core.State = function () {
        bloom.EventDispatcher.call(this);
        this.v = {};
    };

    bloom.inherits(core.State, bloom.EventDispatcher);

    core.State.prototype.increment = function(key, value) {
        if (!this.has(key)) {
            this.set(key, 0);
        }
        return this.set(key, this.get(key) + (value || 1));
    };
    core.State.prototype.decrement = function(key, value) {
        if (!this.has(key)) {
            this.set(key, 0);
        }
        return this.set(key, this.get(key) - (value || 1));
    };
    core.State.prototype.set = function(key, value) {
        if (this.v[key] !== value) {
            this.v[key] = value;
            var e = {
                type: 'change',
                key: key,
                value: value,
                state: this
            };
            this.dispatch(e);
        }
    };

    core.State.prototype.has = function(key) {
        return this.v.hasOwnProperty(key);
    };
    core.State.prototype.get = function(key) {
        var v = this.v;
        if (!v.hasOwnProperty(key)) {
            if (arguments.length > 1) {
                return arguments[1];
            }
            return null;
        }
        return this.v[key];
    };

    core.State.prototype.all = function() {
        return this.v;
    };

}());
