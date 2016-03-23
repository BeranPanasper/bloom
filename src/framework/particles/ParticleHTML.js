/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        dom = bloom.ns('utilities.dom'),
        core = bloom.ns('core');

    particles.ParticleHTML = function (opts) {
        particles.Particle.call(this, opts);
        this.classname = opts && opts.hasOwnProperty('classname') ? opts.classname : '';
        this.content = opts && opts.hasOwnProperty('content') ? opts.content : '';
        this.container = opts && opts.hasOwnProperty('container') ? opts.container : null;
    };

    bloom.inherits(particles.ParticleHTML, particles.Particle);

    particles.ParticleHTML.prototype.start = function () {
        this.element = dom.create('span', {
            'class': 'particle ' + this.classname,
            innerHTML: this.content
        });
        if (!!this.container) {
            this.container.appendChild(this.element);
        }
    };

    particles.ParticleHTML.prototype.update = function () {
        var s = this.element.style,
            p = this.position,
            r = this.rot,
            o = this.opacity;

        s.left = p.x + 'px';
        s.bottom = p.y + 'px';
        if (!!r) {
            s.transform = 'rotate(' + r + 'deg)';
        }
        if (!!o && o < 1) {
            s.opacity = o;
        }
    };

    particles.ParticleHTML.prototype.end = function () {
        var e = this.element;
        if (!!e) {
            if (e.parentNode) {
                e.parentNode.removeChild(e);
            }
            this.element = null;
        }
        if (!!this.container) {
            this.container = null;
        }
    };


}());