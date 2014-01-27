'use strict';

describe('Integration Test', function () {

  before(function (done) {
    primus.on('open', done);
  });

  it('receives a reply', function () {
    var data = {
      message: 'hello server!'
    };
    return primus.request(data)
      .then(function(reply) {
        expect(reply).to.equal('hello client!');
      });
  });

});