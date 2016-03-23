/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        core = bloom.ns('core');

    particles.Emitter = function (opts) {
        this.position = opts && opts.hasOwnProperty('position') ? opts.position : new core.Vector();
        this.num = opts && opts.hasOwnProperty('num') ? opts.num : 10;
        this.lifetime = opts && opts.hasOwnProperty('lifetime') ? opts.lifetime : 1000;
        this.constr = particles.Particle;
    };

    particles.Emitter.prototype.emit = function (system, num, factory) {
        var p;
        while (num >= 0) {
            p = this.create(system, factory);
            num -= 1;
        }
    };

    particles.Emitter.prototype.create = function (system, factory) {
        var p = !!factory ? factory() : new this.constr();
        if (!!this.position && !p.position) {
            p.position.copy(this.position);
        }
        if (p.lifetime === null) {
            p.lifetime = this.lifetime;
        }
        system.add(p);
        return p;
    };


    particles.Emitter.prototype.end = function () {
        if (!!this.position) {
            this.position = null;
        }
    };

}());