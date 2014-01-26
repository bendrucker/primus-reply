'use strict';

var expect         = require('chai').expect,
    sinon          = require('sinon'),
    primus         = require('../../mocks/primus-client').primus,
    Primus         = require('../../mocks/primus-client').Primus,
    plugin         = require('../../../src/client/plugin'),
    RequestManager = require('../../../src/client/request-manager'),
    Request        = require('../../../src/client/request');

describe('Plugin (Client)', function () {

  before(function () {
    primus.use('primus-reply', plugin);
  });

  it('assigns options.requestTimeout to Request', function () {
    new Primus(null, {
      requestTimeout: 100
    }).use('primus-reply', plugin);
    expect(Request.prototype)
      .to.have.property('timeout', 100);
  });
  
  describe('primus.transform:incoming', function () {

    beforeEach(function () {
      sinon.stub(RequestManager, '_handleReply');
      this.incoming = function (packet) {
        return primus.transformers.incoming[0].call(primus, packet);
      };
    });

    afterEach(function () {
      RequestManager._handleReply.restore();
    });

    it('handles plugin messages', function () {
      var packet = {
        data: {
          plugin: 'primus-reply'
        }
      };
      expect(this.incoming(packet)).to.be.false;
      sinon.assert.calledWith(RequestManager._handleReply, packet.data);
    });

    it('ignores non-plugin messages', function () {
      var packet = {
        data: null
      };
      expect(this.incoming(packet)).to.not.be.false;
      sinon.assert.notCalled(RequestManager._handleReply);
    });

  });

  describe('spark.request', function () {

    beforeEach(function () {
      this.spark = new primus.spark();
      sinon.spy(this.spark, 'write');
      sinon.spy(RequestManager, 'add');
      this.callback = sinon.spy();
      this.data = 'data';
      RequestManager.reset();
      this.request = this.spark.request(this.data, this.callback);
    });

    afterEach(function () {
      RequestManager.add.restore();
    });

    it('adds a new request to the RequestManager', function () {
      sinon.assert.calledWith(RequestManager.add, sinon.match.instanceOf(Request));
      expect(this.request).to.have.deep.property('envelope.data', this.data);
      expect(this.request).to.have.property('callback', this.callback);
    });

    it('writes the request envelope', function () {
      sinon.assert.calledWith(this.spark.write, this.request.envelope);
    });

    it('returns the request', function () {
      expect(this.request).to.be.an.instanceOf(Request);
    });

  });

});