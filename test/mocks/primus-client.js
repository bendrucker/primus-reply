'use strict';

var EventEmitter = require('events').EventEmitter;

function Primus (server, options) {
  this.server = server;
  this.options = options || {};
  this.transformers = {
    incoming: []
  };
}

Primus.prototype = Object.create(EventEmitter.prototype);

Primus.prototype.transform = function (direction, callback) {
  this.transformers[direction].push(callback);
};

Primus.prototype.write = function () {};

module.exports = {
  Primus: Primus,
  primus: new Primus()
};