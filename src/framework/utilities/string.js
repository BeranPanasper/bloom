(function () {
    var string = bloom.ns('utilities.string');

    string.format = function(str) {
        var a = Array.prototype.slice.call(arguments, 1);
        return str.replace(/{(\d+)}/g, function(match, number) {
            return typeof a[number] != 'undefined' ? a[number] : match;
        });
    };

    string.capitalize = function(str) {
        return str[0].toUpperCase() + str.slice(1);
    };
}());
