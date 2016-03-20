

(function() {
    var components = bloom.ns('core.components'),
        dom = bloom.ns('utilities.dom'),
        string = bloom.ns('utilities.string');

    components.HTMLContent = function(options) {
        this.template = null;
        this.html = 'No template given';

        if (!!options && options.hasOwnProperty('template')) {
            this.template = options.template;
            var t = dom.get('#tpl-' + this.template);
            if (!t) {
                this.html = string.format('Template "{0}" not found', this.template);
            } else {
                this.html = t.textContent;
            }
        }
    };

}());
