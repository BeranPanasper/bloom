(function () {
    var array = bloom.ns('utilities.array');

    array.apply = function(arr, fName) {
        var i, l = arr.length, o;
        for (i = 0; i < l; i += 1) {
            o = arr[i][fName];
            if (typeof o === 'function') {
                o.apply(arr[i]);
            };
        }
    };

}());
