

(function() {
    var network = bloom.ns('network'),
        dom = bloom.ns('utilities.dom');

    network.CSSLoader = function CSSLoader(file) {
        if (!!file) {
            this.file = file;
            this.loader = new network.XHRLoader(file);
        }
    };

    network.CSSLoader.prototype = {
        load: function(callback) {
            var self = this;
            this.loader.load(function(err, response) {
                if (!!err) {
                    throw new Error('Error while loading file ' + self.file.url);
                } else {
                    var js = dom.create('style', {
                        type: 'text/css',
                        rel: 'stylesheet',
                        innerHTML: response
                    });
                    document.head.appendChild(js);
                }
                callback(err, self.file, response);
            });
        }
    };

}());
