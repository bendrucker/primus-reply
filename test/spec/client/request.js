'use strict';

var Request      = require('../../../src/client/request'),
    sinon        = require('sinon'),
    expect       = require('chai').expect,
    _            = require('lodash');

describe('Request', function () {

  beforeEach(function () {
    this.data = {
      p: 'v'
    };
    this.callback = sinon.spy();
    this.request = new Request(this.data, this.callback);
  });

  describe('Constructor', function () {

    it('creates a deferred', function () {
      expect(this.request)
        .to.have.a.deep.property('deferred.promise');
    });

    it('stores the callback', function () {
      expect(this.request)
        .to.have.a.property('callback', this.callback);
    });

    describe('request.envelope', function () {

      beforeEach(function () {
        this.envelope = this.request.envelope;
      });

      it('identifies the plugin', function () {
        expect(this.envelope)
          .to.have.property('plugin', 'primus-reply');
      });

      it('assigns a UUID', function () {
        expect(this.envelope)
          .to.have.property('uuid')
          .that.is.a('string')
          .with.length(36);
      });

      it('includes the request data', function () {
        expect(this.envelope)
          .to.have.property('data', this.data);
      });

    });

  });

  describe('#id', function () {

    it('returns the request ID', function () {
      expect(this.request.id())
        .to.equal(this.request.envelope.uuid);
    });

  });

  describe('#finally', function () {

    it('proxies the promise.finally method', function () {
      var promise = this.request.deferred.promise;
      this.fin = sinon.stub(promise, 'finally');
      this.request['finally'](0, 0);
      sinon.assert.calledOn(this.fin, promise);
      sinon.assert.calledWith(this.fin, 0, 0);
    });

  });

  describe('#resolve', function () {

    beforeEach(function () {
      this.request.resolve(_.clone(this.data));
    });

    it('resolves the deferred', function () {
      return expect(this.request.deferred.promise)
        .to.eventually.deep.equal(this.data);
    });

    it('calls the callback', function () {
      sinon.assert.calledWith(this.callback, null, this.data);
    });

  });

  describe('#reject', function () {

    beforeEach(function () {
      this.error = new Error();
      this.request.reject(this.error);
    });

    it('rejects the deferred', function () {
      expect(this.request.deferred.promise)
        .to.be.rejectedWith(this.error);
    });

    it('calls the callback', function () {
      sinon.assert.called(this.callback, this.error, null);
    });

  });

  describe('#ontimeout', function () {

    beforeEach(function () {
      sinon.spy(this.request, 'reject');
      this.request.ontimeout();
    });

    it('triggers a rejection', function () {
      sinon.assert.calledWith(this.request.reject, sinon.match.instanceOf(Error));
    });

    it('composes a timeout error', function () {
      var error = this.request.reject.firstCall.args[0];
      expect(error.message)
        .to.contain('timed out')
        .and.to.contain(this.request.timeout + 'ms');
    });
  
  });

});