/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        core = bloom.ns('core');

    particles.System = function () {
        this.gravity = new core.Vector(0, -1);
        this.wind = new core.Vector();
        this.particles = [];
    };


    particles.System.prototype.add = function (p) {
        if (p.delay === 0) {
            p.start();
        }
        this.particles.push(p);
    };

    particles.System.prototype.update = function (time, delta) {
        var ps = this.particles,
            p,
            i,
            l = ps.length,
            currWind = this.wind.clone().multiplyScalar(delta / 10),
            currGravity = this.gravity.clone().multiplyScalar(delta / 10);

        for (i = l - 1; i >= 0; i -= 1) {
            p = ps[i];
            if (!p.pUpdate(this, delta, currWind, currGravity)) {
                p.pEnd();
                ps.splice(i, 1);
            }
        }
    };
    particles.System.prototype.end = function (p) {
        var ps = this.particles,
            i,
            l = ps.length;
        for (i = l - 1; i >= 0; i -= 1) {
            ps[i].pEnd();
        }
    };


}());