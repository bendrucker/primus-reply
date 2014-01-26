'use strict';

function Primus (server, options) {
  this.server = server;
  this.options = options;
  this.transformers = {
    incoming: []
  };
}

Primus.prototype.use = function (name, plugin) {
  plugin.client.call(this, this, this.options);
};

Primus.prototype.transform = function (direction, callback) {
  this.transformers[direction].push(callback);
};

Primus.prototype.spark = function () {};

Primus.prototype.spark.prototype.write = function () {};

module.exports = {
  Primus: Primus,
  primus: new Primus()
};