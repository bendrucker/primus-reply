'use strict';

var RequestManager = {
  _pending: {},
  add: function (request) {
    // Add the request to the pending object
    this._pending[request.id()] = request;

    // Start the request timeout ticker
    request.timer = setTimeout(request._ontimeout.bind(request), request.timeout);

    // Remove the promise from the pending list when it either resolves or
    // rejects without affecting the promise chain
    request['finally'](function () {
      RequestManager.remove(request);
    });

    return request;
  },
  get: function (id) {
    // Return the request with the specified ID
    return this._pending[id];
  },
  remove: function (request) {
    // Clear the timeout timer and delete the request from pending
    clearTimeout(request.timer);
    delete this._pending[request.id()];
  },
  reset: function () {
    // Empty all pending requests
    RequestManager._pending = {};
  },
  _handleReply: function (reply) {
    // Resolve the request matching the reply uuid with the data
    var request = this.get(reply.uuid);
    if (request) {
      request.resolve(reply.data);
    }
  }
};

module.exports = RequestManager;