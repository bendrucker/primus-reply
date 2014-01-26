'use strict';

var Request = require('./request');

module.exports = {
  server: function (primus) {
    primus.transform('incoming', function (packet) {
      var data = packet.data;
      if (data && data.plugin && data.plugin === 'primus-reply') {
        this.emit('request', new Request(data, this.write.bind(this)));
        return false;
      }
    });
  }
};