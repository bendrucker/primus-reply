'use strict';

var expect  = require('chai').expect,
    sinon   = require('sinon'),
    primus  = require('../../mocks/primus-server').primus,
    plugin  = require('../../../src/server/plugin'),
    Request = require('../../../src/server/request');

describe('Plugin (Server)', function () {

  before(function () {
    primus.use('primus-reply', plugin);
  });
  
  describe('primus.transform:incoming', function () {

    beforeEach(function () {
      this.spark = new primus.spark();
      sinon.spy(this.spark, 'emit');
      this.incoming = function (packet) {
        return primus.transformers.incoming[0].call(this.spark, packet);
      };
    });

    it('handles plugin messages', function () {
      var packet = {
        data: {
          plugin: 'primus-reply'
        }
      };
      expect(this.incoming(packet)).to.be.false;
      sinon.assert.calledWith(this.spark.emit, 'request', sinon.match.instanceOf(Request));
    });

    it('ignores non-plugin messages', function () {
      var packet = {
        data: null
      };
      expect(this.incoming(packet)).to.not.be.false;
      sinon.assert.neverCalledWith(this.spark.emit, 'request');
    });

  });

});