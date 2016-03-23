/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        core = bloom.ns('core');

    particles.Particle = function (opts) {
        this.lifetime = opts && opts.hasOwnProperty('lifetime') ? opts.lifetime : 1000;
        this.lt = 0;
        this.position = opts && opts.hasOwnProperty('position') ? opts.position : new core.Vector();
        this.rotation = opts && opts.hasOwnProperty('rotation') ? opts.rotation : 0;
        this.rot = 0;
        this.velocity = opts && opts.hasOwnProperty('velocity') ? opts.velocity : null;
        this.delay = opts && opts.hasOwnProperty('delay') ? opts.delay : 0;
        this.opacity = 1;
        this.mass = opts && opts.hasOwnProperty('mass') ? opts.mass : 1.5;
        this.disappear = opts && opts.hasOwnProperty('disappear') ? opts.disappear : -1;
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
            v = this.velocity,
            r = this.rotation,
            dis = this.disappear,
            disd,
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

        this.rot += r;
        if (dis > -1) {
            disd = this.lifetime - dis;
            if (this.lt > disd) {
                this.opacity = 1 - (this.lt - disd) / dis;
            }
        }
        p.add(wind)
            .add(gravity);

        if (!!v) {
            p.add(v);
            v.divideScalar(this.mass);
        }

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