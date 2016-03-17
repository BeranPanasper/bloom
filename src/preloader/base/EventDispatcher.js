
(function () {
    'use strict';

    bloom.EventDispatcher = function EventDispatcher() {
        this.listeners = {};
    };

    bloom.EventDispatcher.prototype.dispatch = function(e) {
        var lse = this.listeners[e.type], i, l, o;
        if (!lse) {
            return;
        }
        e.target = this;
        for (i = 0, l = lse.length; i < l; i += 1) {
            if (typeof lse[i][e.type + 'Handler'] === 'function') {
                lse[i][e.type + 'Handler'](e);
            } else {
                lse[i](e);
            }
        }
    };
    bloom.EventDispatcher.prototype.on = function(e, target) {
        var ls = this.listeners;

        if (!ls.hasOwnProperty(e)) {
            ls[e] = [];
        }

        ls[e].push(target);
        return this;
    };
    bloom.EventDispatcher.prototype.isListeningTo = function(e, target) {
        var ls = this.listeners;

        return ls.hasOwnProperty(e) && ls[e].indexOf(target) > -1;
    };
    bloom.EventDispatcher.prototype.off = function(e, target) {
        var ls = this.listeners,
            lse = ls[e];

        if (!lse || lse.indexOf(target) === -1) {
            return;
        }

        lse.splice(lse.indexOf(target), 1);
        return this;
    };

}());
