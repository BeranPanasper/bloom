
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
