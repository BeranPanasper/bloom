

(function() {
    var network = bloom.ns('network');

    network.JSONLoader = function JSONLoader(file) {
        if (!!file) {
            this.file = file;
            this.loader = new network.XHRLoader(file);
        }
    };

    network.JSONLoader.prototype = {
        load: function(callback) {
            var self = this;
            this.loader.load(function(err, response) {
                if (!!err) {
                    throw new Error('Error while loading file ' + self.file.url);
                } else {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        throw new Error('Unable to parse JSON response');
                    }
                }
                callback(err, self.file, response);
            });
        }
    };

}());
