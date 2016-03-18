(function () {
    var math = bloom.ns('utilities.math');

    /**
     * Return the sum of all numbers in given array. Assumes that given array
     * is actually an array of numbers (no type check).
     *
     * @memberOf bloom.utilities.math
     * @param  {Array} a An array of numbers
     * @return {Number}   The sum of all numbers in given array
     */
    math.sum = function(a) {
        var s = 0, i, l = a.length;
        for (i = 0; i < l; i += 1) {
            s += a[i];
        }
        return s;
    };

    /**
     * Normalize all numbers in given array and return a new array
     * (divide all numbers by the maximum value found in array).
     *
     * @param  {Array} a An array of numbers
     * @return {Array}   A new array with normalized numbers
     */
    math.normalize = function(a) {
        var max = Math.max.apply(null, a),
            i,
            l = a.length,
            r = [];
        for (i = 0; i < l; i += 1) {
            r[i] = a[i] / max;
        }
        return r;
    };

    math.random = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

}());
