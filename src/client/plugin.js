'use strict';

var RequestManager = require('./request-manager'),
    Request        = require('./request');

module.exports = function (primus, options) {
  Request.prototype.timeout = options.requestTimeout || Request.prototype.timeout;

  primus.transform('incoming', function (packet) {
    var data = packet.data;
    if (data && data.plugin && data.plugin === 'primus-reply') {
      RequestManager._handleReply(data);
      return false;
    }
  });

  primus.request = function (data, callback) {
    // Create a new pending request object
    var request = RequestManager.add(new Request(data, callback));
    // Write the request envelope using spark.write
    this.write(request.envelope);
    // return the request for chaining
    return request;
  };
};