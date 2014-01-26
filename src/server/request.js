'use strict';

function Request (envelope, write) {
  this.envelope = envelope;
  this.data = envelope.data;
  this.write = write;
}

Request.prototype.reply = function (data) {
  this.write({
    plugin: 'primus-reply',
    uuid: this.envelope.uuid,
    data: data
  });
};

module.exports = Request;