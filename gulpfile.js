'use strict';

var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    rename     = require('gulp-rename'),
    size       = require('gulp-filesize');

gulp.task('build', function () {
  gulp.src('src/client/plugin.js')
    .pipe(rename('client.js'))
    .pipe(browserify({
      detectGlobals: true,
      builtins: {}
    }))
    .pipe(gulp.dest('./build'))
    .pipe(size());
});