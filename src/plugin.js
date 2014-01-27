'use strict';

var server = require('./server/plugin').server,
    client = require('./client/plugin').client,
    fs     = require('fs');

client.toString = function () {
  return require('../build/client');
};

module.exports = {
  server: server,
  client: client
};