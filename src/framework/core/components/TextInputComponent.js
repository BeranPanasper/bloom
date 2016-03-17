

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
