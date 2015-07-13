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
  return del(['dist'], cb);
});

gulp.task('build:cleanup', function(cb) {
  return del([
    'dist/meta-*',
    'dist/polymer*',
    'dist/lib.js',
    'dist/metaroom-markup.local.html'
  ], cb);
});

gulp.task('build:html', function () {
  return gulp.src('dist/metaroom-markup.local.html')
    .pipe($.vulcanize({
      abspath: '',
      excludes: [
      ],
      stripExcludes: false,
      inlineScripts: true,
      inlineCss: false,
      implicitStrip: true,
      stripComments: false
    }))
    .on('error', $.util.log)
    .pipe($.rename('metaroom-markup.html'))
    .pipe(gulp.dest('dist'))
    .pipe($.debug({title: 'build:html touch file:'}))
})

gulp.task('build:js', function () {
  var bundleStream = browserify({
    entries: './src/lib/lib.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify]
  });

  return bundleStream.bundle()
    .pipe(source('lib.js'))
    .pipe($.streamify($.uglify()))
    .on('error', $.util.log)
    .pipe(gulp.dest('dist'));
});

gulp.task('copy:webComponents', function () {
  return gulp.src([
    'src/meta-*.html'
  ])
  .pipe(gulp.dest('dist'));
});

gulp.task('copy:webComponentsJS', function () {
  return gulp.src([
    'src/meta-*.js',
  ])
    .pipe($.plumber())
    .pipe($.browserify({
      transform: [babelify]
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('copy:metaroomMarkup', function () {
  return gulp.src([
    'src/metaroom-markup.html',
  ])
  .pipe($.rename('metaroom-markup.local.html'))
  .pipe(gulp.dest('dist'));
});

gulp.task('build:copy',['copy:webComponents', 'copy:metaroomMarkup', 'copy:webComponentsJS'])

gulp.task('build', function(callback) {
  return runSequence('build:clean',
              ['build:js', 'build:copy'],
              'build:html', 'build:cleanup',
              callback);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe($.webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('test', ['build', 'webserver'], function(){
  gulp.watch(['lib/*.js', 'src/*.js', 'src/*.html', 'bower_components', 'test/**/*.html', 'test/**/*.js', 'test/index.html'], ['build', 'test:local']);
});

gulp.task('default', ['build', 'webserver'], function () {
  gulp.watch(['lib/*.js', 'src/*.js', 'src/*.html', 'bower_components'], ['build']);
})
