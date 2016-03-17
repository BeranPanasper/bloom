
(function() {
    var utilities = bloom.ns('utilities');

    utilities.Pool = function Pool(constructor) {
        this.pool = [];
        this.constructor = constructor;
    };

    utilities.Pool.prototype = {
        get: function (options) {
            var p = this.pool,
                i;
            if (p.length) {
                i = p.splice(0, 1)[0];
            } else {
                i = new (this.constructor)(options);
            }
            return i;
        },
        release: function(instance) {
            if (!(instance instanceof this.constructor)) {
                throw new Error('bloom: Releasing wrong class in pool');
            }
            this.pool.push(instance);
        }
    };

}());
