(function () {
    var dom = bloom.ns('utilities.dom'),
        w = window,
        d = document;

    dom.create = function(type, attrs) {
        var el = d.createElement(type), k;
        if (!!attrs) {
            for (k in attrs) {
                if (attrs.hasOwnProperty(k)) {
                    if (k === 'innerHTML' || k === 'innerText') {
                        el[k] = attrs[k];
                    } else {
                        el.setAttribute(k, attrs[k]);
                    }
                }
            }
        }
        return el;
    };

    dom.on = function(e, cb) {
        w.addEventListener(e, cb);
    };

    dom.off = function(e, cb) {
        w.removeEventListener(e, cb);
    };

    dom.get = function(selector, el) {
        return (el || document).querySelector(selector);
    };

}());
