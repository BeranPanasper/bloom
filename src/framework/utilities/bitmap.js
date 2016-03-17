(function() {

    var bitmap = bloom.ns('bloom.utilities.bitmap'),
        dom = bloom.ns('bloom.utilities.dom');

    bitmap.heightmap = function(img) {
        var canvas = dom.create('canvas'),
            context,
            size,
            data,
            i,
            imgd,
            pix,
            j;

        canvas.width = img.width;
        canvas.height = img.height;
        context = canvas.getContext('2d');

        size = img.width * img.height;
        data = new Float32Array(size);
        context.drawImage(img,0,0);
        for (i = 0; i < size; i += 1) {
            data[i] = 0
        }

        imgd = context.getImageData(0, 0, img.width, img.height);
        pix = imgd.data;

        j = 0;
        for (i = 0; i < pix.length; i += 4, j += 1) {
            data[j] = (pix[i] + pix [i + 1] + pix[i + 2]) / (255 * 3);
        }

        return data;
    };
}());
