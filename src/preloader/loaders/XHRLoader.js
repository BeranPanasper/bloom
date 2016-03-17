
(function() {
    var network = bloom.ns('network');

    network.XHRLoader = function XHRLoader(options) {
        this.url = null;
        this.xhr = null;
        this.inited = false;

        if (!!options) {
            if (!!options.url) {
                this.url = options.url;
                this.init();
            }
        }
    };
    network.XHRLoader.prototype = {
        method: 'GET',
        init: function() {
            if (this.inited) {
                return;
            }
            this.inited = true;

            var self = this,
                responded = false,
                xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (responded || xhr.readyState < 4) {
                    return;
                }

                if (xhr.status < 200 || xhr.status > 204) {
                    responded = true;
                    self.callback(true, xhr.responseText, xhr);
                } else if (xhr.readyState === 4) {
                    responded = true;
                    self.callback(false, xhr.responseText, xhr);
                }
            }

            this.xhr = xhr;
        },
        load: function(callback) {
            this.init();
            this.callback = callback;
            this.xhr.open(this.method, this.url);
            this.xhr.send();
        }
    };

}());
