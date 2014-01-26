'use strict';

var primus = {
  transformers: {
    incoming: []
  },
  transform: function (direction, callback) {
    this.transformers[direction].push(callback);
  },
  spark: function () {}
};

primus.spark.prototype.write = function () {};

module.exports = primus;