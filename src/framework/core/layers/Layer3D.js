

(function() {
    var core = bloom.ns('core'),
        dom = bloom.require('utilities.dom');

    core.Layer3D = function() {
        core.Layer.call(this);

    };

    bloom.inherits(core.Layer3D, core.Layer);
    bloom.prototype(core.Layer3D, {
        start: function() {

        },
        end: function() {

        }
    });

}());
