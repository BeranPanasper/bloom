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


(function() {
    var input = bloom.ns('input'),
        keyboard = bloom.ns('input.keyboard');



}());


(function() {
    var keyboard = bloom.ns('input.keyboard'),
        dom = bloom.ns('utilities.dom'),
        dispatcher = new bloom.EventDispatcher(),

        map = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            93: 'meta',
            224: 'meta'
        },
        shift = false,
        keys = [],

        nextNormalCode = null,
        whichToCode = {};

    (function() {
        var key;
        for (k in map) {
            if (map.hasOwnProperty(k)) {
                key = map[k];
                keyboard[key.toUpperCase()] = key;
            }
        }
    }());

    keyboard.getKey = function(key) {
        return keys.indexOf(key) > -1;
    };

    keyboard.on = dispatcher.on.bind(dispatcher);
    keyboard.off = dispatcher.off.bind(dispatcher);

    dom.on('keydown', function(e) {
        var key,
            i;

        if (!map.hasOwnProperty(e.which)) {
            nextNormalCode = e.which;
            return;
        }

        e.preventDefault();
        key = map[e.which];
        i = keys.indexOf(key);
        if (i === -1) {
            keys.push(key);
        }
        //console.log('down', keys);
        dispatcher.dispatch({
            type: 'keydown',
            key: key,
            keys: keys
        });
    });
    dom.on('keypress', function(e) {
        e.preventDefault();

        if (map.hasOwnProperty(e.which)) {
            return;
        }

        var key = String.fromCharCode(e.which),
            i = keys.indexOf(key);

        if (!key) {
            return;
        }
        if (i === -1) {
            keys.push(key);
        }


        if (!whichToCode.hasOwnProperty(e.which) && !!nextNormalCode) {
            whichToCode[nextNormalCode] = key;
        }

        nextNormalCode = null;
        dispatcher.dispatch({
            type: 'keydown',
            key: key,
            keys: keys
        });
    });
    dom.on('keyup', function(e) {
        var key,
            i;
        if (!!map.hasOwnProperty(e.which)) {
            key = map[e.which];
        } else if (whichToCode.hasOwnProperty(e.which)) {
            key = whichToCode[e.which];
        }
        i = keys.indexOf(key);

        if (i > -1) {
            while (i > -1) {
                keys.splice(i, 1);
                i = keys.indexOf(key)
            }
            dispatcher.dispatch({
                type: 'keyup',
                key: key,
                keys: keys
            });
        }
        e.preventDefault();
    });

}());




(function() {
    var sound = bloom.ns('sound'),
        tween = bloom.ns('tween'),
        dom = bloom.ns('utilities.dom');

    sound.Sound = function(options) {
        bloom.EventDispatcher.call(this);
        this.id = options.id;
        this.volume = options.volume || 1;
        this.loop = !!options.loop;
        this.tween = null;
        this.element = dom.create('audio', {
            src: options.url
        });
        console.log(this.loop, this.id);
        this.element.loop = this.loop;
        this.setVolume(this.volume);


        this.element.addEventListener('playing', function() {
            console.log('Start playing', this.id);
        }.bind(this));
        this.element.addEventListener('pause', function() {
            console.log('Stopped playing', this.id);
        }.bind(this));
        this.element.addEventListener('suspend', function() {
            console.log('Suspend', this.id);
        }.bind(this));
    };

    bloom.inherits(sound.Sound, bloom.EventDispatcher);

    sound.Sound.prototype.autoRelease = true;
    sound.Sound.prototype.loop = false;
    sound.Sound.prototype.volume = 1;
    sound.Sound.prototype.pan = 0;
    sound.Sound.prototype.play = function() {
        this.element.play();
    };
    sound.Sound.prototype.pause = function() {
        this.element.pause();
    };
    sound.Sound.prototype.stop = function() {
        this.element.pause();
        this.rewind();
    };
    sound.Sound.prototype.fadeIn = function() {
        this.element.play();
        if (this.getVolume() < 1) {

        }
        this.tween = tween.get(this.getVolume(), 1)
    };
    sound.Sound.prototype.fadeOut = function() {

    };
    sound.Sound.prototype.rewind = function() {
        this.element.currentTime = 0;
    };
    sound.Sound.prototype.setVolume = function(volume) {
        this.volume = volume;
        this.element.volume = volume;
    };
    sound.Sound.prototype.getVolume = function() {
        return this.volume;
    };
    sound.Sound.prototype.setLoop = function(loop) {
        this.loop = loop;
        this.element.loop = loop;
    };
    sound.Sound.prototype.getLoop = function() {
        return this.loop;
    };
    sound.Sound.prototype.panTo = function() {

    };
    sound.Sound.prototype.invertPan = function() {

    };
    sound.Sound.prototype.cancelTween = function() {
        if (this.tween) {
            this.tween.cancel();
            this.tween = null;
        }
    };

}());



(function() {
    var sound = bloom.ns('sound'),
        dom = bloom.ns('utilities.dom');

    sound.SoundMixer = function(options) {
        bloom.EventDispatcher.call(this);
        this.store = null;
        this.sounds = [];
        this.soundsById = {};
        this.playing = false;
    };

    bloom.inherits(sound.SoundMixer, bloom.EventDispatcher);

    bloom.prototype(sound.SoundMixer, {
        volume: 1,
        bindToStore: function(store) {
            if (!(store instanceof sound.SoundStore)) {
                throw new Error('Given store is not a sound.SoundStore');
            }
            this.store = store;
        },
        add: function(id) {
            var sound = this.store.get(id);
            sound.setLoop(true);
            this.sounds.push(sound);
            this.soundsById[id] = id;
            if (this.playing) {
                sound.play();
            }
        },
        has: function(id) {
            return this.soundsById.hasOwnProperty(id);
        },
        remove: function(id) {
            if (!this.soundsById.hasOwnProperty(id)) {
                return;
            }
            var i = 0, ss = this.sounds, l = ss.length, sound;
            for (i = 0; i < l; i += 1) {
                if (ss[i].id === id) {
                    sound = ss[i];
                    break;
                }
            }

            if (sound) {
                this.store.release(id, sound);
                sound.stop();
                ss.splice(i, 1);
            }
            delete this.soundsById[id];
        },
        apply: function(method) {
            var i = 0, ss = this.sounds, l = ss.length;
            for (i = 0; i < l; i += 1) {
                ss[i][method]();
            }
        },
        play: function() {
            if (!this.playing) {
                this.playing = true;
                this.apply('play');
            }
        },
        stop: function() {
            this.playing = false;
            this.apply('stop');
        },
        pause: function() {
            this.playing = false;
            this.apply('pause');
        },
        fadeIn: function() {
            this.play();
            //this.apply('fadeIn');
        },
        fadeOut: function() {
            this.stop();
            //this.apply('fadeOut');
        },
        rewind: function() {
            this.apply('rewind');
        },
        setVolume: function(volume) {
            this.volume = volume;
        },
        getVolume: function() {
            return this.volume;
        },
        panTo: function() {

        },
        invertPan: function() {
            this.apply('invertPan');
        },
        // TO BE USED AS COMPONENT
        start: function() {
            this.fadeIn();
        },
        end: function() {
            this.fadeOut();
        },
    });

}());



(function() {
    var sound = bloom.ns('sound'),
        utilities = bloom.ns('utilities'),
        file = bloom.ns('utilities.file'),
        string = bloom.ns('utilities.string');

    sound.SoundStore = function(options) {
        this.manifest = null;
        this.pools = {};
        if (!!options && options.hasOwnProperty('manifest')) {
            this.manifest = options.manifest;
            this.importFromManifest();
        }
    };

    bloom.prototype(sound.SoundStore, {
        importFromManifest: function() {
            if (!this.manifest) {
                return;
            }
            var sounds = this.manifest.getByType(file.SOUND), i, l = sounds.length;
            for (i = 0; i < l; i += 1) {
                if (!!sounds[i].id) {
                    this.register(sounds[i].id, sounds[i]);
                }
            }
        },
        register: function(id, options) {
            var ps = this.pools;
            // IFDEF DEBUG
            if (ps.hasOwnProperty(id)) {
                throw new Error(string.format('bloom: Sound.register: sound "{0}" already registered', id));
            }
            // /IFDEF DEBUG
            ps[id] = {
                pool: new utilities.Pool(sound.Sound),
                options: options
            };
        },
        get: function(id) {
            var ps = this.pools;
            if (!ps.hasOwnProperty(id)) {
                throw new Error(string.format('bloom: Sound.get: No sound found with id "{0}"', id));
            }
            return ps[id].pool.get(ps[id].options);
        },
        release: function(id, sound) {
            var ps = this.pools;
            if (!ps.hasOwnProperty(id)) {
                throw new Error(string.format('bloom: Sound.release: No sound found with id "{0}"', id));
            }
            ps[id].pool.release(sound);
        },
        once: function(id) {
            var s = this.get(id);
            console.log(s);
            s.play();
        }
    });

}());

/*global bloom*/
(function () {
    'use strict';

    var easing = bloom.ns('tween.easing');

    easing.Linear = {
        None: function (k) {
            return k;
        }
    };
    easing.Quadratic = {
        In: function (k) {
            return k * k;
        },
        Out: function (k) {
            return k * (2 - k);
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * ((k -= 1) * (k - 2) - 1);
        }
    };
    easing.Cubic = {
        In: function (k) {
            return k * k * k;
        },
        Out: function (k) {
            return (k -= 1) * k * k + 1;
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        }
    };
    easing.Quartic = {
        In: function (k) {
            return k * k * k * k;
        },
        Out: function (k) {
            return 1 - ((k -= 1) * k * k * k);
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);
        }
    };
    easing.Quintic = {
        In: function (k) {
            return k * k * k * k * k;
        },
        Out: function (k) {
            return (k -= 1) * k * k * k * k + 1;
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        }
    };
    easing.Sinusoidal = {
        In: function (k) {
            return 1 - Math.cos(k * Math.PI / 2);
        },
        Out: function (k) {
            return Math.sin(k * Math.PI / 2);
        },
        InOut: function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }
    };
    easing.Exponential = {
        In: function (k) {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },
        Out: function (k) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        },
        InOut: function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        }
    };
    easing.Circular = {
        In: function (k) {
            return 1 - Math.sqrt(1 - k * k);
        },
        Out: function (k) {
            return Math.sqrt(1 - ((k -= 1) * k));
        },
        InOut: function (k) {
            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    };
    easing.Elastic = {
        In: function (k) {
            var s,
                a = 0.1,
                p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        },
        Out: function (k) {
            var s,
                a = 0.1,
                p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        },
        InOut: function (k) {
            var s,
                a = 0.1,
                p = 0.4;
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }
            if ((k *= 2) < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            }
            return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
        }
    };
    easing.Back = {
        In: function (k) {
            var s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },
        Out: function (k) {
            var s = 1.70158;
            return (k -= 1) * k * ((s + 1) * k + s) + 1;
        },
        InOut: function (k) {
            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    };
    easing.Bounce = {
        In: function (k) {
            return 1 - easing.Bounce.Out(1 - k);
        },
        Out: function (k) {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            } else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            } else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            } else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        },
        InOut: function (k) {
            if (k < 0.5) {
                return easing.Bounce.In(k * 2) * 0.5;
            }
            return easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    };

}());
/*global bloom*/
(function () {
    'use strict';

    var interpolation = bloom.ns('tween.interpolation');


    interpolation.Linear = function (v, k) {
        var m = v.length - 1,
            f = m * k,
            i = Math.floor(f),
            fn = interpolation.Utils.Linear;
        if (k < 0) {
            return fn(v[0], v[1], f);
        }
        if (k > 1) {
            return fn(v[m], v[m - 1], m - f);
        }
        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    };

    interpolation.Bezier = function (v, k) {
        var b = 0,
            n = v.length - 1,
            pw = Math.pow,
            bn = interpolation.Utils.Bernstein,
            i;

        for (i = 0; i <= n; i += 1) {
            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        }
        return b;
    };
    interpolation.CatmullRom = function (v, k) {
        var m = v.length - 1,
            f = m * k,
            i = Math.floor(f),
            fn = interpolation.Utils.CatmullRom;

        if (v[0] === v[m]) {
            if (k < 0) {
                i = Math.floor(f = m * (1 + k));
            }
            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
        } else {
            if (k < 0) {
                return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            }
            if (k > 1) {
                return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }
            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        }
    };
    interpolation.Utils = {
        Linear: function (p0, p1, t) {
            return (p1 - p0) * t + p0;
        },
        Bernstein: function (n, i) {
            var fc = interpolation.Utils.Factorial;
            return fc(n) / fc(i) / fc(n - i);
        },
        Factorial: (function () {
            var a = [1];
            return function (n) {
                var s = 1,
                    i;

                if (a[n]) {
                    return a[n];
                }
                for (i = n; i > 1; i -= 1) {
                    s *= i;
                }
                a[n] = s;
                return s;
            };
        }()),
        CatmullRom: function (p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5,
                v1 = (p3 - p1) * 0.5,
                t2 = t * t,
                t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    };

}());
/*global bloom*/
(function () {
    'use strict';

    var tween = bloom.ns('tween'),
        easing = bloom.ns('tween.easing'),
        interpolation = bloom.ns('tween.interpolation'),
        core = bloom.ns('core');

    tween.Tween = function (opts) {
        if (!!opts) {
            this.init(opts);
        }
    };

    tween.Tween.prototype.delay = 0;
    tween.Tween.prototype.elapsed = 0;
    tween.Tween.prototype.duration = 1000;
    tween.Tween.prototype.init = function (opts) {
        if (opts.hasOwnProperty('delay') && opts.delay !== undefined) {
            this.delay = opts.delay;
        } else {
            this.delay = 0;
        }
        if (opts.hasOwnProperty('duration') && opts.duration !== undefined) {
            this.duration = opts.duration;
        } else {
            this.duration = 1000;
        }
        if (opts.hasOwnProperty('easing') && opts.easing !== undefined) {
            this.easing = opts.easing;
        } else {
            this.easing = easing.Linear.None;
        }
        if (opts.hasOwnProperty('interpolation') && opts.interpolation !== undefined) {
            this.interpolation = opts.interpolation;
        } else {
            this.interpolation = interpolation.Linear;
        }
        if (opts.hasOwnProperty('startValues') && opts.startValues !== undefined) {
            this.startValues = opts.startValues;
        } else if (opts.hasOwnProperty('from') && opts.from !== undefined) {
            this.startValues = opts.from;
        } else {
            this.startValues = {};
        }

        if (opts.hasOwnProperty('endValues') && opts.endValues !== undefined) {
            this.endValues = opts.endValues;
        } else if (opts.hasOwnProperty('to') && opts.to !== undefined) {
            this.endValues = opts.to;
        } else {
            this.endValues = {};
        }

        this.elapsed = 0;
        this.result = {};
    };

    tween.Tween.prototype.update = function (time, delta) {
        var starters = this.startValues,
            enders = this.endValues,
            object = this.result,
            elapsed = this.elapsed,
            duration = this.duration,
            ended = false,
            start,
            end,
            value,
            property,
            cb = this.onUpdate;

        elapsed += delta;
        if (elapsed >= duration) {
            elapsed = duration;
            ended = true;
        }
        this.elapsed = elapsed;

        value = this.easing(elapsed / this.duration);
        for (property in starters) {
            if (starters.hasOwnProperty(property)) {
                start = starters[property];
                end = enders[property];
                object[property] = start + (end - start) * value;
            }
        }

        if (typeof cb === 'function') {
            cb(object, elapsed);
        }

        if (ended) {
            cb = this.onEnd;
            if (typeof cb === 'function') {
                cb(object, elapsed);
            }

            return false;
        }

        return true;
    };


}());
/*global bloom*/
(function () {
    'use strict';

    var tween = bloom.ns('tween'),
        utilities = bloom.ns('utilities'),
        core = bloom.ns('core');

    tween.Tweener = function () {
        this.tweens = [];
        this.pool = new utilities.Pool(tween.Tween);
    };

    tween.Tweener.prototype.add = function (tween) {
        this.tweens.push(tween);
    };
    tween.Tweener.prototype.remove = function (tween) {
        this.removeByIndex(this.tweens.indexOf(tween));
    };
    tween.Tweener.prototype.removeByIndex = function (index) {
        this.tweens.splice(index, 1);
    };
    tween.Tweener.prototype.update = function (time, delta) {
        var ts = this.tweens, l;
        for (l = this.tweens.length - 1; l >= 0; l -= 1) {
            if (!ts[l].update(time, delta)) {
                this.removeByIndex(l);
            }
        }
    };

    tween.tweener = new tween.Tweener();

    tween.tween = function (from, to, duration, cb, easing, interpolation) {
        var tt = tween.tweener,
            p = tt.pool,
            t = p.get();

        t.init({
            startValues: from,
            endValues: to,
            duration: duration,
            easing: easing,
            interpolation: interpolation
        });

        t.onUpdate = cb;

        t.onEnd = function () {
            p.release(t);
        };

        tt.add(t);
    };

}());
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

(function() {

    var bitmap = bloom.ns('bloom.utilities.bitmap'),
        dom = bloom.ns('bloom.utilities.dom');

    bitmap.heightmap = function(img) {
        var canvas = dom.create('canvas'),
            context,
            size,
            data,
            i,
            imgd,
            pix,
            j;

        canvas.width = img.width;
        canvas.height = img.height;
        context = canvas.getContext('2d');

        size = img.width * img.height;
        data = new Float32Array(size);
        context.drawImage(img,0,0);
        for (i = 0; i < size; i += 1) {
            data[i] = 0
        }

        imgd = context.getImageData(0, 0, img.width, img.height);
        pix = imgd.data;

        j = 0;
        for (i = 0; i < pix.length; i += 4, j += 1) {
            data[j] = (pix[i] + pix [i + 1] + pix[i + 2]) / (255 * 3);
        }

        return data;
    };
}());

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

(function () {
    var math = bloom.ns('utilities.math');

    /**
     * Return the sum of all numbers in given array. Assumes that given array
     * is actually an array of numbers (no type check).
     *
     * @memberOf bloom.utilities.math
     * @param  {Array} a An array of numbers
     * @return {Number}   The sum of all numbers in given array
     */
    math.sum = function(a) {
        var s = 0, i, l = a.length;
        for (i = 0; i < l; i += 1) {
            s += a[i];
        }
        return s;
    };

    /**
     * Normalize all numbers in given array and return a new array
     * (divide all numbers by the maximum value found in array).
     *
     * @param  {Array} a An array of numbers
     * @return {Array}   A new array with normalized numbers
     */
    math.normalize = function(a) {
        var max = Math.max.apply(null, a),
            i,
            l = a.length,
            r = [];
        for (i = 0; i < l; i += 1) {
            r[i] = a[i] / max;
        }
        return r;
    };

    math.random = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

}());

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

/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        core = bloom.ns('core');

    particles.Emitter = function (opts) {
        this.position = opts && opts.hasOwnProperty('position') ? opts.position : new core.Vector();
        this.num = opts && opts.hasOwnProperty('num') ? opts.num : 10;
        this.lifetime = opts && opts.hasOwnProperty('lifetime') ? opts.lifetime : 1000;
        this.constr = particles.Particle;
    };

    particles.Emitter.prototype.emit = function (system, num, factory) {
        var p;
        while (num >= 0) {
            p = this.create(system, factory);
            num -= 1;
        }
    };

    particles.Emitter.prototype.create = function (system, factory) {
        var p = !!factory ? factory() : new this.constr();
        if (!!this.position && !p.position) {
            p.position.copy(this.position);
        }
        if (p.lifetime === null) {
            p.lifetime = this.lifetime;
        }
        system.add(p);
        return p;
    };


    particles.Emitter.prototype.end = function () {
        if (!!this.position) {
            this.position = null;
        }
    };

}());
/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        core = bloom.ns('core');

    particles.Particle = function (opts) {
        this.lifetime = opts && opts.hasOwnProperty('lifetime') ? opts.lifetime : 1000;
        this.lt = 0;
        this.position = opts && opts.hasOwnProperty('position') ? opts.position : new core.Vector();
        this.rotation = opts && opts.hasOwnProperty('rotation') ? opts.rotation : 0;
        this.rot = 0;
        this.velocity = opts && opts.hasOwnProperty('velocity') ? opts.velocity : null;
        this.delay = opts && opts.hasOwnProperty('delay') ? opts.delay : 0;
        this.opacity = 1;
        this.mass = opts && opts.hasOwnProperty('mass') ? opts.mass : 1.5;
        this.disappear = opts && opts.hasOwnProperty('disappear') ? opts.disappear : -1;
        this.start();
    };

    particles.Particle.prototype.start = function () {
    };
    particles.Particle.prototype.update = function () {
    };
    particles.Particle.prototype.end = function () {
    };

    particles.Particle.prototype.pUpdate = function (system, delta, wind, gravity) {
        var p = this.position,
            d = this.delay,
            v = this.velocity,
            r = this.rotation,
            dis = this.disappear,
            disd,
            b;

        if (d > 0) {
            d -= delta;
            this.delay = d;
            if (d > 0) {
                return true;
            } else {
                this.start();
            }
        }

        this.lt += delta;
        if (this.lt >= this.lifetime) {
            return false;
        }

        this.rot += r;
        if (dis > -1) {
            disd = this.lifetime - dis;
            if (this.lt > disd) {
                this.opacity = 1 - (this.lt - disd) / dis;
            }
        }
        p.add(wind)
            .add(gravity);

        if (!!v) {
            p.add(v);
            v.divideScalar(this.mass);
        }

        b = this.update();
        return typeof b === 'boolean' ? b : true;
    };

    particles.Particle.prototype.pEnd = function () {
        this.end();
        if (!!this.position) {
            this.position = null;
        }
    };

}());
/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        dom = bloom.ns('utilities.dom'),
        core = bloom.ns('core');

    particles.ParticleHTML = function (opts) {
        particles.Particle.call(this, opts);
        this.classname = opts && opts.hasOwnProperty('classname') ? opts.classname : '';
        this.content = opts && opts.hasOwnProperty('content') ? opts.content : '';
        this.container = opts && opts.hasOwnProperty('container') ? opts.container : null;
    };

    bloom.inherits(particles.ParticleHTML, particles.Particle);

    particles.ParticleHTML.prototype.start = function () {
        this.element = dom.create('span', {
            'class': 'particle ' + this.classname,
            innerHTML: this.content
        });
        if (!!this.container) {
            this.container.appendChild(this.element);
        }
    };

    particles.ParticleHTML.prototype.update = function () {
        var s = this.element.style,
            p = this.position,
            r = this.rot,
            o = this.opacity;

        s.left = p.x + 'px';
        s.bottom = p.y + 'px';
        if (!!r) {
            s.transform = 'rotate(' + r + 'deg)';
        }
        if (!!o && o < 1) {
            s.opacity = o;
        }
    };

    particles.ParticleHTML.prototype.end = function () {
        var e = this.element;
        if (!!e) {
            if (e.parentNode) {
                e.parentNode.removeChild(e);
            }
            this.element = null;
        }
        if (!!this.container) {
            this.container = null;
        }
    };


}());
/*global bloom*/
(function () {
    'use strict';

    var particles = bloom.ns('particles'),
        core = bloom.ns('core');

    particles.System = function () {
        this.gravity = new core.Vector(0, -1);
        this.wind = new core.Vector();
        this.particles = [];
    };


    particles.System.prototype.add = function (p) {
        if (p.delay === 0) {
            p.start();
        }
        this.particles.push(p);
    };

    particles.System.prototype.update = function (time, delta) {
        var ps = this.particles,
            p,
            i,
            l = ps.length,
            currWind = this.wind.clone().multiplyScalar(delta / 10),
            currGravity = this.gravity.clone().multiplyScalar(delta / 10);

        for (i = l - 1; i >= 0; i -= 1) {
            p = ps[i];
            if (!p.pUpdate(this, delta, currWind, currGravity)) {
                p.pEnd();
                ps.splice(i, 1);
            }
        }
    };
    particles.System.prototype.end = function (p) {
        var ps = this.particles,
            i,
            l = ps.length;
        for (i = l - 1; i >= 0; i -= 1) {
            ps[i].pEnd();
        }
    };


}());


(function() {
    var core = bloom.ns('core'),
        array = bloom.ns('utilities.array'),
        string = bloom.ns('utilities.string');

    core.Actor = function() {
        this.components = [];
        this.layer = null;
        this.state = new core.State();
    };

    core.Actor.prototype.play = function() {
        array.apply(this.components, 'play');
    };

    core.Actor.prototype.pause = function() {
        array.apply(this.components, 'pause');
    };

    core.Actor.prototype.getGame = function() {
        return this.layer.scene.game;
    };

    core.Actor.prototype.requireRedraw = function() {
        var cs = this.components,
            i,
            l = cs.length;
        for (i = 0; i < l; i += 1) {
            if (typeof cs[i].requireRedraw === 'function') {
                cs[i].requireRedraw();
            }
        }
    };

    core.Actor.prototype.getComponent = function(constructor) {
        var cs = this.components,
            i,
            l = cs.length;
        for (i = 0; i < l; i += 1) {
            if (cs[i] instanceof constructor) {
                return cs[i];
            }
        }
        return null;
    };

    core.Actor.prototype.add = function(component) {
        if (!component) {
            throw new Error('Component is undefined');
        }
        this.components.push(component);
        component.state = this.state;
        component.actor = this;
        this.layer.registerComponent(component);
    };

    core.Actor.prototype.remove = function(component) {
        var cs = this.components,
            i = cs.indexOf(component);
        if (i > -1) {
            cs.splice(i, 1);
        }
        component.state = null;
        component.actor = null;
        this.layer.unregisterComponent(component);
    };
}());

/*global bloom*/

(function () {
    'use strict';

    var core = bloom.ns('core');

    core.Component = function () {

    };
    core.Component.prototype.actor = null;
    core.Component.prototype.state = null;
    core.Component.prototype.getLayer = function () {
        if (this.actor) {
            return this.actor.layer;
        }
        return null;
    };
    core.Component.prototype.getComponent = function (constructor) {
        if (this.actor) {
            return this.actor.getComponent(constructor);
        }
        return null;
    };
    core.Component.prototype.getActor = function () {
        return this.actor;
    };
    core.Component.prototype.getLayer = function () {
        return this.actor.layer;
    };
    core.Component.prototype.getScene = function () {
        return this.actor.layer.scene;
    };
    core.Component.prototype.getGame = function () {
        return this.actor.layer.scene.game;
    };
}());



(function() {
    var core = bloom.ns('core'),
        network = bloom.ns('network'),
        sound = bloom.ns('sound'),
        dom = bloom.ns('utilities.dom'),
        string = bloom.ns('utilities.string');

    core.instances = [];

    /**
     * A game is a holder for the scenes. It allows to
     * navigate between each scene. It's also the initiator
     * of the main loop for each game.
     *
     */
    core.Game = function(initializer) {
        this.current = null;
        this.scenes = [];
        this.scenesById = {};
        this.loader = null;
        this.manifest = null;
        this.paused = false;
        this.ts = 0;
        core.instances.push(this);

        if (initializer instanceof core.GameInitializer) {
            this.loader = initializer.loader;
            this.manifest = initializer.manifest;
        }

        this.sounds = new sound.SoundStore({
            manifest: this.manifest
        });

        dom.get('#wrapper').innerHTML = '';
    };

    core.Game.prototype.apply = function(scene, f) {
        if (!scene) {
            return;
        }
        if (f === 'end' && typeof scene.endTransition === 'function') {
            scene.endTransition(function() {
                scene.applyAutoRemoval();
                if (typeof scene[f] === 'function') {
                    scene.end();
                }
            });
            return;
        }
        if (typeof scene[f] === 'function') {
            if (f === 'end') {
                scene.applyAutoRemoval();
            }
            scene[f]();
        }
        if (f === 'start' && typeof scene.startTransition === 'function') {
            scene.startTransition();
        }
    };

    core.Game.prototype.start = function () {
        if (!this.scenes.length) {
            throw new Error('No scene to start with!');
        }
        if (this.current === null) {
            this.goto('main');
        }
    };
    core.Game.prototype.goto = function(id) {
        if (this.current !== null) {
            this.apply(this.current, 'end');
            this.current = null;
        } else {
            console.log(dom.get('#wrapper').innerHTML);
            dom.get('#wrapper').innerHTML = '';
        }
        if (!this.scenesById.hasOwnProperty(id)) {
            console.warn('Scene not found: "' + id + '"');
            return;
        }

        this.current = this.scenesById[id];
        this.apply(this.current, 'start');
        if (!!this.paused) {
            this.play();
        }
    };
    core.Game.prototype.pause = function() {
        if (!this.paused) {
            this.paused = true;
            this.apply(this.current, 'triggerPause');
        }
    };
    core.Game.prototype.play = function() {
        if (!!this.paused) {
            this.paused = false;
            this.apply(this.current, 'triggerPlay');
        }
    };
    core.Game.prototype.switchPause = function() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    };
    core.Game.prototype.update = function (time, delta) {
        this.delta = time - this.ts;
        this.ts = time;
        if (!!this.paused) {
            return;
        }
        if (this.current !== null) {
            this.current.update(time, this.delta);
        }
    };
    core.Game.prototype.add = function(scene) {
        if (!(scene instanceof core.Scene)) {
            throw new Error('Given scene must be a bloom.core.Scene instance');
        }
        var id,
            sbi = this.scenesById,
            scs = this.scenes;

        if (!scene.id && !scs.length) {
            scene.id = 'main';
        }
        id = scene.id;
        if (!id) {
            throw new Error('Scene requires an ID');
        }

        scene.game = this;

        if (sbi.hasOwnProperty(id)) {
            if (sbi[id] !== scene) {
                throw new Error(string.format('Another scene already has ID "{0}". Each scene ID must be unique.', id));
            }
        } else {
            scs.push(scene);
            sbi[id] = scene;
        }
    };
    core.Game.prototype.remove = function(scene) {
        if (!(scene instanceof core.Scene)) {
            throw new Error('Given scene must be a bloom.core.Scene instance');
        }

        scene.game = null;

        var i = this.scenes.indexOf(scene);
        if (i > -1) {
            this.scenes.splice(i, 1);
        }
        if (this.scenesById.hasOwnProperty(scene.id)) {
            delete this.scenesById[scene.id];
        }
    };
    core.Game.prototype.end = function() {
        var is = core.instances,
            i = is.indexOf(this);
        if (i > -1) {
            is.splice(i, 1);
        }
        this.current = null;
    };

}());



(function() {
    var core = bloom.ns('core'),
        array = bloom.ns('utilities.array');

    core.Layer = function(opts) {
        this.actors = [];
        this.updatable = [];
        this.scene = null;
        this.dummy = null;
        this.element = null;
        this.id = opts && opts.hasOwnProperty('id') ? opts.id : null;
    };

    core.Layer.prototype.getElement = function() {
        return this.element;
    };
    core.Layer.prototype.play = function() {
        array.apply(this.actors, 'play');
    };

    core.Layer.prototype.pause = function() {
        array.apply(this.actors, 'pause');
    };

    core.Layer.prototype.add = function(actor) {
        if (actor instanceof core.Component) {
            this.addComponent(actor);
            return;
        }

        this.actors.push(actor);
        actor.layer = this;

        if (typeof actor.update === 'function') {
            this.updatable.push(actor);
        }
        if (typeof actor.start === 'function') {
            actor.start();
        }
    };
    core.Layer.prototype.update = function(time, delta) {
        var us = this.updatable,
            i,
            l = us.length;

        for (i = 0; i < l; i += 1) {
            us[i].update(time, delta);
        };
    };
    core.Layer.prototype.remove = function(actor) {
        if (actor instanceof core.Component) {
            this.removeComponent(actor);
            return;
        }

        var os = this.actors,
            us = this.updatable,
            i;

        if (typeof actor.end === 'function') {
            actor.end();
        }

        this.unregisterComponentOf(actor);

        actor.layer = null;

        i = os.indexOf(actor);
        if (i > -1) {
            os.splice(i, 1);
        }

        i = us.indexOf(actor);
        if (i > -1) {
            us.splice(i, 1);
        }
    };

    core.Layer.prototype.addComponent = function(component) {
        if (!this.dummy) {
            this.dummy = new core.Actor();
            this.add(this.dummy);
        }
        this.dummy.add(component);
    };
    core.Layer.prototype.removeComponent = function(component) {
        if (!!this.dummy) {
            this.dummy.remove(component);
        }
    };

    core.Layer.prototype.registerComponent = function(component) {
        this.attachComponent(component);
        if (typeof component.start === 'function') {
            component.start();
        }
        if (typeof component.update === 'function') {
            this.updatable.push(component);
        }
    };
    core.Layer.prototype.unregisterComponentOf = function(actor) {
        var ccs = actor.components, i, l = ccs.length;
        for (i = 0; i < l; i += 1) {
            this.unregisterComponent(ccs[i]);
        }
    };
    core.Layer.prototype.unregisterComponent = function(component) {
        var us = this.updatable,
            i;

        if (typeof component.end === 'function') {
            component.end();
        }

        this.detachComponent(component);

        if (typeof component.update === 'function') {
            i = us.indexOf(component);
            if (i > -1) {
                us.splice(i, 1);
            }
        }
    };
    core.Layer.prototype.attachComponent = function(component) {};
    core.Layer.prototype.detachComponent = function(component) {};

}());



(function() {
    var core = bloom.ns('core'),
        array = bloom.ns('utilities.array');

    core.Scene = function(options) {
        this.id = null;
        this.game = null;
        this.layers = [];
        this.paused = false;
        this.autoRemoval = true;
        if (!!options) {
            if (options.hasOwnProperty('id')) {
                this.id = options.id;
            }
        }
    };

    core.Scene.prototype.triggerPlay = function() {
        array.apply(this.layers, 'play');
        if (typeof this.play === 'function') {
            this.play();
        }
    };

    core.Scene.prototype.triggerPause = function() {
        array.apply(this.layers, 'pause');
        if (typeof this.pause === 'function') {
            this.pause();
        }
    };

    core.Scene.prototype.update = function (time, delta) {
        var ls = this.layers, i, l = ls.length;
        for (i = 0; i < l; i += 1) {
            ls[i].update(time, delta);
        }
    };
    core.Scene.prototype.add = function(layer) {
        if (!(layer instanceof core.Layer)) {
            throw new Error('Given layer must be a bloom.core.Layer instance');
        }
        layer.scene = this;
        this.layers.push(layer);
        if (typeof layer.start === 'function') {
            layer.start();
        }
    };
    core.Scene.prototype.applyAutoRemoval = function() {
        if (!this.autoRemoval) {
            return;
        }
        var ls = this.layers, l;
        for (l = ls.length - 1; l >= 0; l -= 1) {
            this.remove(ls[l]);
        }
    };
    core.Scene.prototype.remove = function(layer) {
        if (!(layer instanceof core.Layer)) {
            throw new Error('Given layer must be a bloom.core.Layer instance');
        }

        layer.scene = null;
        if (typeof layer.end === 'function') {
            layer.end();
        }
        var i = this.layers.indexOf(layer);
        if (i > -1) {
            this.layers.splice(i, 1);
        }
    };
    core.Scene.prototype.destroy = function() {
        this.layers = null;
    };

}());



(function() {
    var core = bloom.ns('core');

    core.State = function () {
        bloom.EventDispatcher.call(this);
        this.v = {};
    };

    bloom.inherits(core.State, bloom.EventDispatcher);

    core.State.prototype.increment = function(key, value) {
        if (!this.has(key)) {
            this.set(key, 0);
        }
        return this.set(key, this.get(key) + (typeof value === 'number' ? value : 1));
    };
    core.State.prototype.decrement = function(key, value) {
        if (!this.has(key)) {
            this.set(key, 0);
        }
        return this.set(key, this.get(key) - (typeof value === 'number' ? value : 1));
    };
    core.State.prototype.set = function(key, value) {
        if (this.v[key] !== value) {
            this.v[key] = value;
            var e = {
                type: 'change',
                key: key,
                value: value,
                state: this
            };
            this.dispatch(e);
        }
    };

    core.State.prototype.has = function(key) {
        return this.v.hasOwnProperty(key);
    };
    core.State.prototype.get = function(key) {
        var v = this.v;
        if (!v.hasOwnProperty(key)) {
            if (arguments.length > 1) {
                return arguments[1];
            }
            return null;
        }
        return this.v[key];
    };

    core.State.prototype.all = function() {
        return this.v;
    };

}());

/*global bloom*/

(function () {
    'use strict';

    var core = bloom.ns('core');

    core.Vector = function (x, y, z) {
        if (typeof x === 'number') {
            this.x = x;
        }
        if (typeof y === 'number') {
            this.y = y;
        }
        if (typeof z === 'number') {
            this.z = z;
        }
    };

    core.Vector.prototype.x = 0;
    core.Vector.prototype.y = 0;
    core.Vector.prototype.z = 0;

    core.Vector.prototype.clone = function () {
        return new core.Vector(this.x, this.y, this.z);
    };

    core.Vector.prototype.copy = function (vector) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        return this;
    };
    core.Vector.prototype.add = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    };
    core.Vector.prototype.multiplyScalar = function (v) {
        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;
    };
    core.Vector.prototype.multiply = function (vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        return this;
    };
    core.Vector.prototype.divideScalar = function (v) {
        this.x /= v;
        this.y /= v;
        this.z /= v;
        return this;
    };
    core.Vector.prototype.divide = function (vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;
        return this;
    };

}());

/*global bloom, requestAnimationFrame*/
(function () {
    'use strict';

    var loop = bloom.ns('core.loop'),
        debug = bloom.ns('core.debug'),
        tween = bloom.ns('tween'),
        core = bloom.ns('core'),

        instances = core.instances,
        i,
        l,

        delta,
        ts = 0,
        tweener;

    loop.animate = function (time) {

        requestAnimationFrame(loop.animate);

        delta = time - ts;
        ts = time;

        for (i = 0, l = instances.length; i < l; i += 1) {
            instances[i].update(ts);
        }

        if (!tweener) {
            tweener = tween.tweener;
        } else {
            tweener.update(ts, delta);
        }
    };

    loop.animate(0);
}());



(function() {
    var components = bloom.ns('core.components'),
        core = bloom.ns('core');

    components.CanvasComponent = function() {
        core.Component.call(this);
    };
    bloom.inherits(components.CanvasComponent, core.Component);

    components.CanvasComponent.prototype.requireRedraw = function() {
        var a = this.actor, l;
        if (!a) {
            return;
        }
        l = a.layer;
        if (!l) {
            return;
        }
        l.requireRedraw(this);
    };
    components.CanvasComponent.prototype.clear = function(x, y, w, h) {
        var l;
        if (this.actor) {
            l = this.actor.layer;
            l.clear.apply(l, arguments);
        }
    };
}());



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



(function() {
    var components = bloom.ns('core.components'),
        keyboard = bloom.ns('input.keyboard'),
        dom = bloom.ns('utilities.dom');

    components.TextInputComponent = function(options) {
        bloom.EventDispatcher.call(this);
    };

    bloom.inherits(components.TextInputComponent, bloom.EventDispatcher);

    components.TextInputComponent.prototype.text = '';
    components.TextInputComponent.prototype.getText = function() {
        return this.text;
    };

    components.TextInputComponent.prototype.start = function() {
        keyboard.on('keyup', this);
    };

    components.TextInputComponent.prototype.keyToString = function(key) {
        if (key === keyboard.SPACE) {
            return ' ';
        }
        if (key.length === 1) {
            return key;
        }
        return null;
    };
    components.TextInputComponent.prototype.keyupHandler = function(e) {
        var key = e.key,
            t = this.text;

        if (key === keyboard.ENTER && !!this.text) {
            this.dispatch({
                type: 'submit',
                text: this.text
            });

            this.text = '';
            return;
        }

        if (key === keyboard.BACKSPACE) {
            t = t.slice(0, -1);
        } else {
            key = this.keyToString(key);
            if (!!key) {
                t += key;
            }
        }

        if (t !== this.text) {
            this.text = t;
            this.dispatch({
                type: 'input',
                text: this.text
            });
        }
    };


    components.TextInputComponent.prototype.end = function() {
        keyboard.off('keyup', this);
    };
}());



(function() {
    var core = bloom.ns('core'),
        colors = bloom.ns('game.colors'),
        dom = bloom.require('utilities.dom');

    core.Layer2D = function(opts) {
        core.Layer.call(this, opts);
        this.template = null;
        this.w = opts && opts.hasOwnProperty('width') ? opts.width : 800;
        this.h = opts && opts.hasOwnProperty('height') ? opts.height : 450;
        this.element = dom.create('canvas', {
            width: this.w,
            height: this.h
        });
        if (!!this.id) {
            this.element.setAttribute('id', this.id);
        }
        this.requiredRedraw = [];
        this.clearColor = null;
    };

    bloom.inherits(core.Layer2D, core.Layer);

    core.Layer2D.prototype.start = function() {
        dom.get('#wrapper').appendChild(this.element);
    };

    core.Layer2D.prototype.update = function() {
        var i = 0, l = this.requiredRedraw.length, c;
        core.Layer.prototype.update.apply(this, arguments);
        if (l) {
            c = this.getContext();
            for (i = 0; i < l; i += 1) {
                this.requiredRedraw[i].draw(c);
            }
            this.requiredRedraw = [];
        }
    };

    core.Layer2D.prototype.clear = function(x, y, w, h) {
        if (arguments.length === 0) {
            x = 0;
            y = 0;
            w = this.w;
            h = this.h;
        }
        var c = this.getContext();
        if (!!this.clearColor) {
            c.fillStyle = this.clearColor;
            c.fillRect(x, y, w, h);
        } else {
            c.clearRect(x, y, w, h);
        }
    };

    core.Layer2D.prototype.end = function() {
        dom.get('#wrapper').removeChild(this.element);
    };

    core.Layer2D.prototype.requireRedraw = function(component) {
        this.requiredRedraw.push(component);
    };

    core.Layer2D.prototype.getCanvas = function() {
        return this.element;
    };

    core.Layer2D.prototype.getContext = function() {
        return this.element.getContext('2d');
    };

    core.Layer2D.prototype.attachComponent = function(component) {
        if (typeof component.draw === 'function') {
            component.draw(this.getContext());
        }
    };

    core.Layer2D.prototype.detachComponent = function(component) {
        if (typeof component.clear === 'function') {
            component.clear(this.getContext());
        }
    };
}());



(function() {
    var core = bloom.ns('core'),
        dom = bloom.require('utilities.dom');

    core.Layer3D = function() {
        core.Layer.call(this);

    };

    bloom.inherits(core.Layer3D, core.Layer);
    bloom.prototype(core.Layer3D, {
        start: function() {

        },
        end: function() {

        }
    });

}());

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
