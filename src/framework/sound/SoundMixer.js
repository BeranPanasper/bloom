

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
