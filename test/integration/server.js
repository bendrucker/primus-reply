'use strict';

var http   = require('http'),
    Primus = require('primus'),
    plugin = require('../../src/server/plugin');

var server = new http.Server();
var primus = new Primus(server, {
  transformer: 'sockjs'
});
primus.use('primus-reply', plugin);
primus.save(__dirname + '/primus.js');

module.exports = {
  primus: primus,
  listen: function listen (callback) {
    server.listen(9801, function onListen () {
      if (callback) callback();
    });
  }
};