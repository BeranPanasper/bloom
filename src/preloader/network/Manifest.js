(function() {
    var network = bloom.ns('network'),
        file = bloom.ns('utilities.file');

    network.Manifest = function Manifest(manifest) {
        if (typeof manifest === 'string') {
            manifest = [{
                id: 'manifest',
                url: manifest,
                preload: true
            }];
        }

        this.manifest = [];
        this.preloading = [];
        if (!!manifest) {
            this.add(manifest);
        }
    };

    network.Manifest.prototype = {
        add: function(manifest) {
            var i, l = manifest.length, f;
            for (i = 0; i < l; i += 1) {
                f = new network.File(manifest[i]);
                this.manifest.push(f);
                if (manifest[i].preload !== false) {
                    this.preloading.push(f);
                }
            }
        },
        next: function() {
            if (this.preloading.length) {
                return this.preloading.splice(0, 1)[0];
            }
            return null;
        },
        hasNext: function() {
            return this.preloading.length > 0;
        },
        get: function(id) {
            var a = this.manifest, i, l = a.length;
            for (i = 0; i < l; i += 1) {
                if (a[i].id === id) {
                    return a[i].response;
                }
            }
            return null;
        },
        getByType: function(type) {
            var result = [],
                a = this.manifest, i, l = a.length;
            for (i = 0; i < l; i += 1) {
                if (a[i].type === type) {
                    result.push(a[i]);
                }
            }
            return result;
        }
    };
}());
