var gulp = require('gulp'),
  browserify = require('browserify');
  babelify = require('babelify')
  fs = require('fs')
  $ = require('gulp-load-plugins')(),
  Vulcanize = require('vulcanize');
  del = require('del');

var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');

require('web-component-tester').gulp.init(gulp);

gulp.task('build:clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('build:html', function () {
  gulp.src('dist/mr-ml.local.html')
    .pipe($.vulcanize({
      abspath: '',
      excludes: [
      ],
      stripExcludes: false,
      inlineScripts: false,
      inlineCss: false,
      implicitStrip: true,
      stripComments: false
    }))
    .pipe($.rename('mr-ml.html'))
    .pipe(gulp.dest('dist'))
    .on('error', $.util.log)
})

gulp.task('build:js', function () {
  var bundleStream = browserify({
    entries: './src/game-object.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify]
  });

  bundleStream.bundle()
    .pipe(source('game-object.js'))
    .pipe($.streamify($.uglify()))
    .on('error', $.util.log)
    .pipe(gulp.dest('dist'));
});

gulp.task('copy:depsjs', function () {
  gulp.src([
    'bower_components/three.js/three.js',
    'bower_components/webvr-polyfill/index.js',
    'bower_components/webvr-manager/index.js',
    'bower_components/threejs-vreffect/index.js',
    'bower_components/threejs-vrcontrolls/index.js'
  ])
  .pipe($.concat("deps.js"))
  .pipe(gulp.dest('dist'));
});

gulp.task('copy:webComponents', function () {
  gulp.src([
    'bower_components/polymer/polymer*',
    'src/meta-*.html',
    'src/left-wall.html',
  ])
  .pipe(gulp.dest('dist'));
});

gulp.task('copy:metaroomMarkup', function () {
  gulp.src([
    'src/mr-ml.html',
  ])
  .pipe($.rename('mr-ml.local.html'))
  .pipe(gulp.dest('dist'));
});

gulp.task('build:copy',['copy:depsjs', 'copy:webComponents', 'copy:metaroomMarkup'])

gulp.task('build', function(callback) {
  runSequence('build:clean',
              ['build:js', 'build:copy'],
              'build:html', ['build:html'],
              callback);
});

gulp.task('test', ['test:local'])

gulp.task('default', ['build'], function () {
  gulp.watch(['src/*.*js', 'src/*.html', 'bower_components'], ['build']);
})
