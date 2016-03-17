(function() {
    var network = bloom.ns('network'),
        broadcaster = bloom.ns('broadcaster'),
        file = bloom.ns('utilities.file');

    network.LoaderManager = function LoaderManager(manifest) {
        if (typeof manifest === 'string' || typeof manifest === 'object') {
            manifest = new network.Manifest(manifest);
        }
        this.manifest = manifest;
        this.cache = {};
        this.currentTotal = 0;
        this.errors = 0;
    };

    network.LoaderManager.prototype = {
        parallel: 5,
        getManifest: function() {
            return this.manifest;
        },
        load: function() {
            this.next();
        },
        next: function() {
            var self = this;
            while (this.currentTotal < this.parallel && this.manifest.hasNext()) {
                this.currentTotal += 1;
                this.loadFile(this.manifest.next(), function(err, f, result) {
                    if (!err) {
                        f.response = result;
                    } else {
                        self.errors += 1;
                    }
                    self.currentTotal -= 1;
                    broadcaster.publish('loader.progress');

                    if (!err && f.type === file.MANIFEST) {
                        self.manifest.add(result);
                        self.next();
                    } else if (self.currentTotal === 0) {
                        if (!self.manifest.hasNext()) {
                            broadcaster.publish('loader.end');
                        } else {
                            self.next();
                        }
                    }
                });
            }
        },
        loadFile: function(f, callback) {
            var loader = this.getLoader(f);
            if (!!loader) {
                loader.load(callback);
            } else {
                console.warn('No loader found for ' + f.url);
                callback(true);
            }
        },
        getLoader: function(f) {
            switch (f.type) {
                case file.GLSL:
                    return new network.GLSLLoader(f);
                case file.HTML:
                    return new network.HTMLLoader(f);
                case file.JS:
                    return new network.JSLoader(f);
                case file.JSON:
                case file.MANIFEST:
                    return new network.JSONLoader(f);
                case file.IMAGE:
                    return new network.ImageLoader(f);
                case file.CSS:
                    return new network.CSSLoader(f);
                case file.SOUND:
                    return new network.SoundLoader(f);
            }
            return null;
        }
    };
}());
