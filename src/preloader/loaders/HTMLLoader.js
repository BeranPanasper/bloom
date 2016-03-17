

(function() {
    var network = bloom.ns('network'),
        dom = bloom.ns('utilities.dom');

    network.HTMLLoader = function HTMLLoader(file) {
        if (!!file) {
            this.file = file;
            this.loader = new network.XHRLoader(file);
        }
    };

    network.HTMLLoader.prototype = {
        load: function(callback) {
            var self = this;
            this.loader.load(function(err, response) {
                if (!!err) {
                    throw new Error('Error while loading file ' + self.file.url);
                } else {
                    var js = dom.create('div', {
                        class: 'hidden',
                        innerHTML: response
                    });
                    document.body.appendChild(js);
                }
                callback(err, self.file, response);
            });
        }
    };

}());
