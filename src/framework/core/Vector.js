/*global bloom*/

(function () {
    'use strict';

    var core = bloom.ns('core');

    core.Vector = function (x, y, z) {
        if (typeof x === 'number') {
            this.x = x;
        }
        if (typeof y === 'number') {
            this.y = y;
        }
        if (typeof z === 'number') {
            this.z = z;
        }
    };

    core.Vector.prototype.x = 0;
    core.Vector.prototype.y = 0;
    core.Vector.prototype.z = 0;

    core.Vector.prototype.clone = function () {
        return new core.Vector(this.x, this.y, this.z);
    };

    core.Vector.prototype.copy = function (vector) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        return this;
    };
    core.Vector.prototype.add = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    };
    core.Vector.prototype.multiplyScalar = function (v) {
        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;
    };
    core.Vector.prototype.multiply = function (vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        return this;
    };

}());