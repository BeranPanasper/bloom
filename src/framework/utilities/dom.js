(function () {
    var dom = bloom.ns('utilities.dom'),
        string = bloom.ns('utilities.string'),
        d = document,
        b = d.body;


    dom.all = function(selector, el) {
        return (el || b).querySelectorAll(selector);
    };

    dom.html = function(selector, html) {
        dom.get(selector).innerHTML = html;
    };

    dom.absolute = function(element, rootId) {
        var r = {
            top: 0,
            left: 0
        };
        if (element.offsetParent) {
            do {
                r.top += element.offsetTop;
                r.left += element.offsetLeft;
                element = element.offsetParent;
            } while (element && (!rootId ||element.getAttribute('id') !== rootId));
        }
        return r;
    };

}());
