/*global bloom*/

(function () {
    'use strict';

    var core = bloom.ns('core');

    core.Component = function () {

    };
    core.Component.prototype.actor = null;
    core.Component.prototype.state = null;
    core.Component.prototype.getLayer = function () {
        if (this.actor) {
            return this.actor.layer;
        }
        return null;
    };
    core.Component.prototype.getComponent = function (constructor) {
        if (this.actor) {
            return this.actor.getComponent(constructor);
        }
        return null;
    };
    core.Component.prototype.getActor = function () {
        return this.actor;
    };
    core.Component.prototype.getLayer = function () {
        return this.actor.layer;
    };
    core.Component.prototype.getScene = function () {
        return this.actor.layer.scene;
    };
    core.Component.prototype.getGame = function () {
        return this.actor.layer.scene.game;
    };
}());
