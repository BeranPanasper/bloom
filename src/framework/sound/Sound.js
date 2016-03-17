

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
