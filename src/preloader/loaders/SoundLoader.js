

(function() {
    var network = bloom.ns('network'),
        string = bloom.ns('utilities.string');

    network.SoundLoader = function SoundLoader(file) {
        if (!!file) {
            this.file = file;
            this.loader = new network.XHRLoader(file);
        }
    };

    network.SoundLoader.prototype = {
        load: function(callback) {
            var self = this;
            this.loader.load(function(err, response) {
                if (!!err) {
                    throw new Error(string.format('Error while loading file "{0}".', self.file.url));
                }
                callback(err, self.file, response);
            });
        }
    };

}());
