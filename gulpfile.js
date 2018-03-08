const fs = require('fs');
const gulp = require('gulp');
const wrap = require('gulp-wrap');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('mini', () => (
  gulp.src('src/src.js')
  .pipe(wrap({src: 'src/exports.js'}))
  .pipe(rename("gjtool.js"))
  .pipe(gulp.dest('dist/'))
  .pipe(uglify())    //uglify
  .pipe(rename("gjtool.min.js"))
  .pipe(gulp.dest('dist/'))
));