'use strict';

var server = require('./server/plugin').server,
    client = require('./client/plugin').client;

client.toString = function () {
  return fs.readFileSync('./build/client.js');
};

var plugin = {
  server: server,
  client: client
};