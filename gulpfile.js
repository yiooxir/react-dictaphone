'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('merge-stream');

gulp.task('css', function() {

  var scssStream = gulp.src('./src/css/*.scss')
      .pipe(sass())
      .pipe(concat('scss-files.scss'));

  var cssStream = gulp.src('./src/css/*.css')
      .pipe(concat('css-files.css'));

  var mergedStream = merge(scssStream, cssStream)
    .pipe(concat('dc-style.css'))
    .pipe(gulp.dest('lib/assets'));

  return mergedStream;
});
