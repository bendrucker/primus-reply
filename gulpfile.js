'use strict';

var gulp       = require('gulp'),
    util       = require('gulp-util'),
    browserify = require('gulp-browserify'),
    rename     = require('gulp-rename'),
    size       = require('gulp-filesize'),
    mocha      = require('gulp-mocha'),
    spawn      = require('child_process').spawn,
    path       = require('path');

gulp.task('build', function () {
  gulp.src('src/client/plugin.js', {read: false})
    .pipe(browserify({
      standalone: 'primusReply'
    }))
    .pipe(rename('primus-reply-client.js'))
    .pipe(gulp.dest('./build'))
    .pipe(size());
});

gulp.task('test:unit', function () {
  require('./test/setup');
  gulp.src('test/unit/**/*.js')
    .pipe(mocha())
});

gulp.task('test:integration', function (done) {
  var child = spawn('node', [
    path.join(__dirname, 'test', 'integration', 'runner.js'),
  ], {
    stdio: 'inherit'
  }).on('exit', done);
});

gulp.task('test', ['test:unit', 'test:integration']);