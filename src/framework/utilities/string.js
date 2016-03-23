(function () {
    var string = bloom.ns('utilities.string'),

        urlizeAcc = 'Þßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕ',
        urlizeNoAcc = 'bsaaaaaaaceeeeiiiidnoooooouuuyybyr';

    string.format = function(str) {
        var a = Array.prototype.slice.call(arguments, 1);
        return str.replace(/{(\d+)}/g, function(match, number) {
            return typeof a[number] != 'undefined' ? a[number] : match;
        });
    };

    string.capitalize = function(str) {
        if (!str) {
            return str;
        }
        return str[0].toUpperCase() + str.slice(1);
    };

    string.urlize = function(str, char) {
            var str = str.toLowerCase().split(''),
                s = [],
                l = str.length,
                y = 0,
                i = -1 ;

            for ( y; y < l; y+= 1) {
                if (( i = urlizeAcc.indexOf(str[y]) ) > -1) {
                  s[y] = urlizeNoAcc[i];
                } else {
                  s[y] = str[y];
                }
            }

            return s.join('').trim().replace(/[^a-z0-9\-]/g,' ').split(' ').join('-').replace(/[\-]{1,}/g, char || '-');
    };
}());
