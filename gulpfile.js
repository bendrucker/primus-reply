'use strict';

var gulp       = require('gulp'),
    util       = require('gulp-util'),
    browserify = require('gulp-browserify'),
    rename     = require('gulp-rename'),
    size       = require('gulp-filesize'),
    mocha      = require('gulp-mocha'),
    jshint     = require('gulp-jshint'),
    clean      = require('gulp-clean'),
    uglify     = require('gulp-uglify'),
    git        = require('gulp-git'),
    bump       = require('gulp-bump'),
    sequence   = require('run-sequence'),
    spawn      = require('child_process').spawn,
    path       = require('path');

gulp.task('build', function () {
  return gulp.src('src/client/plugin.js', {read: false})
    .pipe(browserify({
      standalone: 'primusReply'
    }))
    .pipe(rename('primus-reply-client.js'))
    .pipe(gulp.dest('.'))
    .pipe(size())
    .pipe(uglify())
    .pipe(rename('primus-reply-client.min.js'))
    .pipe(size())
    .pipe(gulp.dest('.'));
});

gulp.task('clean', function () {
  return gulp.src('primus-reply-client*.js', {read: false})
    .pipe(clean());
});

gulp.task('lint:src', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint('src/.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint:test', function () {
  return gulp.src('test/**/*.js')
    .pipe(jshint('test/.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint', ['lint:src', 'lint:test']);

gulp.task('unit', function () {
  require('./test/setup');
  gulp.src('test/unit/**/*.js')
    .pipe(mocha())
});

gulp.task('integration', ['build'], function (done) {
  spawn('node', [
    path.join(__dirname, 'test', 'integration', 'runner.js'),
  ], {
    stdio: 'inherit'
  }).on('close', done);
});

gulp.task('bump', function () {
  return gulp.src('package.json')
    .pipe(bump())
    .pipe(gulp.dest('.'));
});

gulp.task('release', ['bump'], function () {
  var pkg     = require('./package.json'),
      version = 'v' + pkg.version,
      message = 'Release ' + version;

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(v, message))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('.'));
});

gulp.task('test', function (done) {
  sequence(['unit', 'lint'], 'integration', 'clean');
});