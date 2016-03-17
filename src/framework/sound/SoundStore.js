

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
