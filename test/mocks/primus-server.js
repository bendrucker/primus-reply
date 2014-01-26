'use strict';

var Primus       = require('./primus-client').Primus,
    EventEmitter = require('events').EventEmitter,
    _            = require('lodash');

_.extend(Primus.prototype, EventEmitter.prototype);

Primus.prototype.use = function (name, plugin) {
  if (plugin.client) {
    plugin.client.call(this, this, this.options);
  }
  if (plugin.server) {
    plugin.server.call(this, this, this.options);
  }
};

module.exports = {
  Primus: Primus,
  primus: new Primus()
};