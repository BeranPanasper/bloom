(function() {

    var binding = bloom.ns('binding'),
        string = bloom.ns('utilities.string'),
        dom = bloom.ns('utilities.dom'),
        handlers;

    binding.unwrap = function(observable) {
        if (typeof observable === 'function') {
            return observable();
        }
        return observable;
    };

    binding.observable = function(value) {
        var listeners = [];

        function notify(newValue) {
            listeners.forEach(function(listener){
                listener(newValue);
            });
        }

        function accessor(newValue) {
            if (arguments.length && newValue !== value) {
              value = newValue;
              notify(newValue);
            }
            return value;
        }

        accessor.subscribe = function(listener) {
            listeners.push(listener);

            return {
                dispose: function() {
                    listeners.splice(listeners.indexOf(listener), 1);
                }
            };
        };

        accessor.isObservable = true;

        return accessor;
    };

    handlers = {
        text: function(el, observable) {
            return {
                subscription: null,
                init: function() {
                    this.update(binding.unwrap(observable));

                    if (observable.isObservable) {
                        this.subscription = observable.subscribe(this.update.bind(this));
                    }
                },
                update: function(value) {
                    el.textContent = value;
                },
                cleanup: function() {
                    if (!!this.subscription) {
                        this.subscription.dispose();
                    }
                }
            };
        },
        click: function(el, f) {
            return {
                cb: null,
                init: function() {
                    this.cb = this.click.bind(this);
                    el.addEventListener('click', this.cb);
                },
                click: function() {
                    f();
                },
                cleanup: function() {
                    if (!!this.cb) {
                        el.removeEventListener('click', this.cb);
                        this.cb = null;
                    }
                }
            };
        }
    };

    binding.handlers = handlers;

    binding.apply = function(el, context) {
        var els = dom.all('[data-x]', el),
            i,
            l = els.length,
            binded,
            b;

        for (i = 0; i < l; i += 1) {
            binded = els[i];
            b = binded.getAttribute('data-x');
            binding.applyToElement(binded, context, binding.parseBindings(b));
        }
    };

    binding.applyToElement = function(el, context, bindings) {
        var i, l = bindings.length,
            b,
            handler,
            actualBinding,
            value,
            valueRef;
        for (i = 0; i < l; i += 1) {
            b = bindings[i];
            handler = b.handler;
            value = b.value;
            if (!handlers.hasOwnProperty(handler)) {
                throw new Error(string.format('Handler with id "{0}" not found', handler));
            }
            if (typeof context[value] === 'undefined') {
                throw new Error(string.format('Context property "{0}" not found', value));
            }
            if (typeof context[value] === 'function' && !context[value].isObservable) {
                valueRef = context[value].bind(context);
            } else {
                valueRef = context[value];
            }
            actualBinding = handlers[handler](el, valueRef);
            if (actualBinding.hasOwnProperty('init')) {
                actualBinding.init();
            }
        }
    };

    binding.parseBindings = function(b) {
        var b = b.split(','),
            bi,
            result = [],
            i,
            l = b.length;

        for (i = 0; i < l; i += 1) {
            bi = b[i].split(':');
            result.push({
                handler: (bi[0] || '').trim(),
                value: (bi[1] || '').trim()
            });
        }

        return result;
    };

    binding.clean = function(el) {

    };



}());
