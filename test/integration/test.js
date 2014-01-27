'use strict';

describe('Integration Test', function () {

  it('receives an echo reply', function () {
    var data = {
      message: 'hello server!'
    };
    return primus.request(data)
      .then(function(reply) {
        expect(reply).to.deep.equal(data);
      });
  });

});