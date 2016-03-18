(function () {
    'use strict';

    var bloom = {};

    window.bloom = bloom;

    bloom.ns = function (children) {
        var parts = children.split('.'),
            parent = bloom,
            pl,
            i;

        if (parts[0] === 'bloom') {
            parts = parts.slice(1);
        }

        pl = parts.length;
        for (i = 0; i < pl; i += 1) {
            //create a property if it doesnt exist
            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        return parent;
    };

    bloom.require = function (ns) {
        var parts = ns.split('.'),
            parent = bloom,
            pl,
            i;

        if (parts[0] === 'bloom') {
            parts = parts.slice(1);
        }

        pl = parts.length;
        for (i = 0; i < pl; i += 1) {
            if (typeof parent[parts[i]] === 'undefined') {
                throw new Error('bloom: Namespace "' + ns + '" not valid: "' +
                    parts[i] + '" does not exist.');
            }

            parent = parent[parts[i]];
        }

        return parent;
    };

    bloom.inherits = function (child, parent) {
        child.prototype = Object.create(parent.prototype);
    };

    bloom.prototype = function (classObject, proto) {
        var k;
        for (k in proto) {
            if (proto.hasOwnProperty(k)) {
                classObject.prototype[k] = proto[k];
            }
        }
    };

    bloom.ns('game');
    bloom.ns('core');

}());
