

(function() {
    var network = bloom.ns('network'),
        dom = bloom.ns('utilities.dom');

    network.JSLoader = function JSLoader(file) {
        if (!!file) {
            this.file = file;
            this.loader = new network.XHRLoader(file);
        }
    };

    network.JSLoader.prototype = {
        load: function(callback) {
            var self = this;
            this.loader.load(function(err, response) {
                if (!!err) {
                    throw new Error('Error while loading file ' + self.file.url);
                } else {
                    var js = dom.create('script', {
                        type: 'text/javascript',
                        innerHTML: response
                    });
                    document.head.appendChild(js);
                }
                callback(err, self.file, response);
            });
        }
    };

}());
