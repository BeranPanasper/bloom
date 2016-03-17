(function() {
    var core = bloom.ns('core'),
        network = bloom.ns('network');

    core.GameInitializer = function GameInitializer(manifest) {
        this.loader = null;
        this.manifest = manifest;
    };

    core.GameInitializer.prototype = {
        getLoader: function() {
            if (!!this.loader) {
                return this.loader;
            }
            this.loader = new network.LoaderManager(this.manifest);
            this.manifest = this.loader.getManifest();
            return this.loader;
        }
    };
}());
