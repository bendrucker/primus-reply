'use strict';

var fs     = require('fs'),
    karma  = require('karma').server,
    config = require('./karma.conf.js'),
    server = require('./server.js');


server.listen(function () {
  server.primus.on('connection', function (spark) {
    spark.on('request', function (request) {
      request.reply('hello client!');
    });
  });
  karma.start(config, function (exitCode) {
    fs.unlink(__dirname + '/primus.js', function () {
      server.close(function (){
        process.exit(exitCode);
      });
    });
  });
});