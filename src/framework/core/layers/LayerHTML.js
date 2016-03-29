/*global bloom*/

(function () {
    'use strict';

    var core = bloom.ns('core'),
        string = bloom.ns('utilities.string'),
        dom = bloom.ns('utilities.dom');

    core.LayerHTML = function (options) {
        core.Layer.call(this);
        this.template = null;
        this.classname = null;
        if (!!options) {
            if (typeof options.template === 'string') {
                this.template = options.template;
            }
            if (typeof options.classname === 'string') {
                this.classname = options.classname;
            }
        }
        this.element = dom.create('div', {
            'class': 'layer-html ' + (this.classname || '')
        });

    };

    bloom.inherits(core.LayerHTML, core.Layer);

    core.LayerHTML.prototype.start = function () {
        dom.get('#wrapper').appendChild(this.element);
        if (!!this.template) {
            var t = dom.get('#tpl-' + this.template);
            if (!t) {
                throw new Error(string.format('Template "{0}" not found', this.template));
            }
            this.element.innerHTML = t.innerHTML;
        }
    };

    core.LayerHTML.prototype.end = function () {
        var wrapper = dom.get('#wrapper');
        if (wrapper.contains(this.element)) {
            wrapper.removeChild(this.element);
        }
        this.element.innerHTML = '';
    };
    core.LayerHTML.prototype.attachComponent = function (component) {
        if (component.hasOwnProperty('html')) {
            this.element.innerHTML = component.html;
        }
    };
    core.LayerHTML.prototype.detachComponent = function (component) {
        if (component.hasOwnProperty('html')) {
            this.element.innerHTML = '';
        }
    };


}());
