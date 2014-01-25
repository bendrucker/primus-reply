'use strict';

var Request = require('./request');

var RequestManager = {
  _pending: {},
  add: function (request) {
    var id = request.id();
    // Add the request to the pending object
    this._pending[id] = request;

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
    return this._pending[id];
  },
  remove: function (request) {
    clearTimeout(request.timer);
    delete this._pending[request.id()];
  },
  reset: function () {
    RequestManager._pending = {};
  }
};

module.exports = RequestManager;