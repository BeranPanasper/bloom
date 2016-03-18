/*global bloom */

(function () {
    'use strict';
    
    var broadcaster = bloom.ns('broadcaster'),
        subscriptions = {};

    broadcaster.subscribe = function (e, cb) {
        if (!subscriptions.hasOwnProperty(e)) {
            subscriptions[e] = [];
        }
        subscriptions[e].push(cb);
    };

    broadcaster.unsubscribe = function (e, cb) {
        if (!subscriptions.hasOwnProperty(e)) {
            return;
        }
        var se = subscriptions[e],
            i = se.indexOf(cb);

        if (i > -1) {
            se.splice(i, 1);
        }
    };

    broadcaster.publish = function (e) {
        if (!subscriptions.hasOwnProperty(e)) {
            return;
        }
        var se = subscriptions[e], i, l = se.length;
        for (i = 0; i < l; i += 1) {
            se[i].apply(null, arguments);
        }
    };
}());
