'use strict';

var RequestManager = require('../../../src/client/request-manager'),
    Request        = require('../../../src/client/request'),
    sinon          = require('sinon'),
    expect         = require('chai').expect;

describe('RequestManager', function () {

  beforeEach(function () {
    this.request = new Request();
    this.request.timeout = 10;
  });

  beforeEach(RequestManager.reset);
  
  it('has an internal pending request store', function () {
    expect(RequestManager._pending)
      .to.exist;
  });

  describe('#add', function () {

    beforeEach(function () {
      this.clock = sinon.useFakeTimers();
      sinon.spy(this.request, '_ontimeout');
      this.add = RequestManager.add(this.request);
    });

    afterEach(function () {
      this.clock.restore();
    });

    it('stores the pending requests based on its UUID', function () {
      expect(RequestManager._pending)
        .to.have.property(this.request.envelope.uuid, this.request);
    });

    it('notifies the request when it has timed out', function () {
      this.clock.tick(this.request.timeout);
      sinon.assert.calledOn(this.request._ontimeout, this.request);
    });

    it('removes the request when it is resolved/rejected', function () {
      this.request.resolve();
      expect(RequestManager.get(this.request))
        .to.equal(undefined);
    });

    it('returns the request', function () {
      expect(this.add).to.equal(this.request);
    });

  });

  describe('#get', function () {

    it('gets the request by ID', function () {
      RequestManager.add(this.request);
      expect(RequestManager.get(this.request.id()))
        .to.equal(this.request);
    });

  });

  describe('#remove', function () {

    beforeEach(function () {
      this.clock = sinon.useFakeTimers();
      sinon.spy(this.request, '_ontimeout');
      RequestManager.add(this.request);
      RequestManager.remove(this.request);
    });

    it('removes the request from the pending list', function () {
      expect(RequestManager.get(this.request.id()))
        .to.equal(undefined);
    });

    it('clears the request timer', function () {
      this.clock.tick(this.request.timeout);
      sinon.assert.notCalled(this.request._ontimeout);
    });

  });

  describe('#reset', function () {

    it('clears the pending list', function () {
      RequestManager.add(this.request);
      RequestManager.reset();
      expect(RequestManager._pending).to.be.empty;
    });

  });

  describe('#_handleReply', function () {

    beforeEach(function () {
      RequestManager.add(this.request);
    });

    beforeEach(function () {
      this.reply = {
        uuid: this.request.id(),
        data: 'reply'
      };
      RequestManager._handleReply(this.reply);
    });

    it('resolves the matching request with the reply', function () {
      this.request.then(function (reply) {
        expect(reply).to.equal('reply');
      });
    });

    it('silently drops replies that do not match a request', function () {
      expect(function () {
        RequestManager._handleReply({uuid: '1'});
      }).to.not.throw();
    });

  });

});