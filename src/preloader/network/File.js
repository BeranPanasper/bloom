(function () {
    var network = bloom.ns('network'),
        file = bloom.ns('utilities.file');


    network.File = function File(opts) {
        this.id = null;
        this.url = null;
        this.type = null;
        this.response = null;

        // Sound related
        this.loop = false;
        this.volume = 1;

        if (!!opts) {
            for (var k in opts) {
                if (opts.hasOwnProperty(k) && this.hasOwnProperty(k)) {
                    this[k] = opts[k];
                }
            }
            if (!!this.url) {
                this.type = file.type(opts.url);
            }
        }
    };
}());
