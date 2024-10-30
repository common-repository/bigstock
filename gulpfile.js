'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var envify = require('envify/custom');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');

gulp.task('build', function() {
  var env = process.env.NODE_ENV || 'development';
  var api = 'http://api-beta.bigstockphoto.com/v3';
  var intercomIo = 'j8c9ako1';
  switch (env) {
    case 'dev':
    case 'development':
      intercomIo = 'i5xa0w56';
      api = 'http://dev-apithree02.nj01.bigstockcorp.net/v3';
      break;
    case 'qa':
      intercomIo = 'i5xa0w56';
      api = 'http://api-beta.qa.bigstockphoto.com/v3';
      break;
    default:
    case 'prod':
    case 'production':
      // do nothing
      break;
  }
  return browserify({
    entries: ['./js/bigstockphoto.js'],
    extensions: ['.js', '.json'],
    paths: ['js'],
    debug: true
  })
    .transform('babelify', { presets: ["es2015", "react"] })
    .transform(envify({
      URL: api,
      NODE_ENV: env,
      INTERCOM_IO: intercomIo,
      API_CLIENT_ID: '8f476445a46e0cc8d385195cbc29e2d8dc4b8d8b0d69e569fa33f17ab2243a6f'
    }))
    .bundle()
    .on('error', function(err) { console.log(err.message); })
    .pipe(source('dist/bundle.js'))
    .pipe(gulp.dest('js'))
});

gulp.task('minify', ['build'], function() {
  return gulp.src('js/dist/bundle.js')
    .pipe(uglify())
    .pipe(rename('dist/bundle.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('lint', ['build'], function() {
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('dev', ['lint'], function() {
  gulp.watch(['js/**/*.js', '!js/dist/*.js'], ['lint']);
});

gulp.task('default', ['minify']);
