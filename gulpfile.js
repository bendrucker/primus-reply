'use strict';

var gulp       = require('gulp'),
    util       = require('gulp-util'),
    browserify = require('gulp-browserify'),
    rename     = require('gulp-rename'),
    size       = require('gulp-filesize'),
    mocha      = require('gulp-mocha'),
    jshint     = require('gulp-jshint'),
    spawn      = require('child_process').spawn,
    path       = require('path');

gulp.task('browserify', function () {
  gulp.src('src/client/plugin.js', {read: false})
    .pipe(browserify({
      standalone: 'primusReply'
    }))
    .pipe(rename('primus-reply-client.js'))
    .pipe(gulp.dest('./build'))
    .pipe(size());
});

gulp.task('lint:src', function () {
  return gulp.src('./src/**/*.js')
    .pipe(jshint('./src/.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint:test', function () {
  return gulp.src('./test/**/*.js')
    .pipe(jshint('./test/.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint', ['lint:src', 'lint:test']);

gulp.task('test:unit', function () {
  require('./test/setup');
  gulp.src('test/unit/**/*.js')
    .pipe(mocha())
});

gulp.task('test:integration', ['build'], function (done) {
  var child = spawn('node', [
    path.join(__dirname, 'test', 'integration', 'runner.js'),
  ], {
    stdio: 'inherit'
  }).on('exit', done);
});

gulp.task('test', ['test:unit', 'test:integration']);