

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

        this.state = new core.State();
        this.sounds = new sound.SoundStore({
            manifest: this.manifest
        });
    };

    core.Game.prototype.apply = function(f) {
        var c = this.current;
        if (c && typeof c[f] === 'function') {
            c[f]();
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
            this.apply('end');
            this.current = null;
        }
        if (!this.scenesById.hasOwnProperty(id)) {
            console.warn('Scene not found: "' + id + '"');
            return;
        }
        dom.html('#wrapper', '');
        this.current = this.scenesById[id];
        this.apply('start');
        if (!!this.paused) {
            this.play();
        }
    };
    core.Game.prototype.pause = function() {
        if (!this.paused) {
            this.paused = true;
            this.apply('triggerPause');
        }
    };
    core.Game.prototype.play = function() {
        if (!!this.paused) {
            this.paused = false;
            this.apply('triggerPlay');
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
