'use strict';

var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    rename     = require('gulp-rename'),
    size       = require('gulp-filesize');

gulp.task('build', function () {
  gulp.src('src/client/plugin.js', {read: false})
    .pipe(browserify({
      standalone: 'primusReply'
    }))
    .pipe(rename('primus-reply-client.js'))
    .pipe(gulp.dest('./build'))
    .pipe(size());
});