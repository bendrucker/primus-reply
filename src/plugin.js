'use strict';

var server = require('./server/plugin').server,
    client = require('./client/plugin').client,
    fs     = require('fs');

client.toString = function () {
  return fs.readFileSync('./build/client.js');
};

module.exports = {
  server: server,
  client: client
};