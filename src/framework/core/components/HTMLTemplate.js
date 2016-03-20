

(function() {
    var components = bloom.ns('core.components'),
        core = bloom.ns('core'),
        dom = bloom.ns('utilities.dom'),
        binding = bloom.ns('binding'),
        string = bloom.ns('utilities.string');

    components.HTMLTemplate = function(options) {
        core.Component.call(this);
        this.template = null;
        this.context = null;
        this.html = 'No template given';

        if (!!options) {
            if (options.hasOwnProperty('template')) {
                this.template = options.template;
                var t = dom.get('#tpl-' + this.template);
                if (!t) {
                    this.html = string.format('Template "{0}" not found', this.template);
                } else {
                    this.html = t.textContent;
                }
            }
            if (options.hasOwnProperty('context')) {
                this.context = options.context;
            }
        }
    };

    bloom.inherits(components.HTMLTemplate, core.Component);

    components.HTMLTemplate.prototype.start = function() {
    };

    components.HTMLTemplate.prototype.end = function() {
    };

}());
