/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        core = bloom.ns('core');

    particles.Particle = function (opts) {
        this.lifetime = opts && opts.hasOwnProperty('lifetime') ? opts.lifetime : null;
        this.lt = 0;
        this.position = opts && opts.hasOwnProperty('position') ? opts.position : new core.Vector();
        this.delay = opts && opts.hasOwnProperty('delay') ? opts.delay : 0;
        this.opacity = 1;
        this.start();
    };

    particles.Particle.prototype.start = function () {
    };
    particles.Particle.prototype.update = function () {
    };
    particles.Particle.prototype.end = function () {
    };

    particles.Particle.prototype.pUpdate = function (system, delta, wind, gravity) {
        var p = this.position,
            d = this.delay,
            b;
        if (d > 0) {
            d -= delta;
            this.delay = d;
            if (d > 0) {
                return true;
            } else {
                this.start();
            }
        }

        this.lt += delta;
        if (this.lt >= this.lifetime) {
            return false;
        }
        p.add(wind)
            .add(gravity);

        b = this.update();
        return typeof b === 'boolean' ? b : true;
    };

    particles.Particle.prototype.pEnd = function () {
        this.end();
        if (!!this.position) {
            this.position = null;
        }
    };

}());