var fs     = require('fs'),
    karma  = require('karma').server,
    config = require('./karma.conf.js'),
    server = require('./server.js');

server.listen(function () {
  server.primus.on('connection', function (spark) {
    spark.on('request', function (request) {
      request.reply(request.data);
    });
  });
  karma.start(config, function (exitCode) {
    fs.unlink(__dirname + '/primus.js', function () {
      process.exit(exitCode);
    });
  });
});