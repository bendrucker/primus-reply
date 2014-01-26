'use strict';

var expect  = require('chai').expect,
    sinon   = require('sinon'),
    Request = require('../../../src/server/request'),
    uuid    = require('node-uuid');

describe('Request (Server)', function () {

  beforeEach(function () {
    this.envelope = {
      uuid: uuid.v4(),
      data: 'data'
    };
    this.write = sinon.spy();
    this.request = new Request(this.envelope, this.write);
  });

  it('stores the request envelope', function () {
    expect(this.request)
      .to.have.property('envelope', this.envelope);
  });

  it('stores the request data', function () {
    expect(this.request)
      .to.have.property('data', this.envelope.data);
  });

  it('stores a reply-writer function', function () {
    expect(this.request)
      .to.have.property('write', this.write);
  });

  describe('#reply', function () {

    it('writes the reply data wrapped in the request envelope', function () {
      this.request.reply('reply');
      sinon.assert.calledWith(this.write, sinon.match({
        plugin: 'primus-reply',
        uuid: sinon.match.has('length', 36),
        data: 'reply'
      }));
    });

  });

});