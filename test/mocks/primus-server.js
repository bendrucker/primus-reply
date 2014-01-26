'use strict';

var Primus       = require('./primus-client').Primus,
    EventEmitter = require('events').EventEmitter,
    _            = require('lodash');

_.extend(Primus.prototype, EventEmitter.prototype);

Primus.prototype.use = function (name, plugin) {
  plugin.server.call(this, this, this.options);
};

Primus.prototype.spark = function () {};
Primus.prototype.spark.prototype = Object.create(EventEmitter.prototype);
Primus.prototype.spark.prototype.write = function () {};


module.exports = {
  Primus: Primus,
  primus: new Primus()
};