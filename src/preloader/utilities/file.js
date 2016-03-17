
(function() {
    var file = bloom.ns('utilities.file');

    file.JS = 0;
    file.JSON = 1;
    file.CSS = 2;
    file.GLSL = 3;
    file.IMAGE = 4;
    file.SOUND = 5;
    file.HTML = 6;
    file.UNKNOWN = 9;
    file.MANIFEST;

    file.extension = function(url) {
        return (url + String()).toLowerCase().split('/')
                .pop().split('.').pop().split(/\#|\?/)[0];
    };

    file.type = function(url) {
        var extension = file.extension(url);

        switch (extension) {
            case 'html':
                if (url.indexOf('.glsl.html') > -1) {
                    return file.GLSL;
                }
                return file.HTML;
            case 'mp3':
            case 'ogg':
                return file.SOUND;
            case 'js':
                return file.JS;
            case 'json':
                if (url.indexOf('manifest.json') > -1) {
                    return file.MANIFEST;
                }
                return file.JSON;
            case 'jpeg':
            case 'jpg':
            case 'png':
            case 'gif':
                return file.IMAGE;
            case 'css':
                return file.CSS;
        };
        return file.UNKNOWN;
    };
}());
