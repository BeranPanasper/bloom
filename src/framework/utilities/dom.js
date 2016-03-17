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
    }

}());
