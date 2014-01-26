'use strict';

function Primus () {
  this.transformers = {
    incoming: []
  };
}

Primus.prototype.transform = function (direction, callback) {
  this.transformers[direction].push(callback);
};

Primus.prototype.spark = function () {};

Primus.prototype.spark.prototype.write = function () {};

module.exports = new Primus();