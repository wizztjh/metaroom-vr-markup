var gulp = require('gulp'),
  browserify = require('browserify');
  babelify = require('babelify')
  fs = require('fs')
  $ = require('gulp-load-plugins')();

require('web-component-tester').gulp.init(gulp);

gulp.task('html', function () {
  gulp.src('dist/hp-ml.local.html')
    .pipe($.vulcanize({
      abspath: '',
      excludes: [],
      stripExcludes: false
    }))
    .pipe($.rename('hp-ml.html'))
    .pipe(gulp.dest('dist'));
})

gulp.task('js', function () {
  browserify({ debug: true })
    .transform(babelify)
    .require("./src/hp-ml.js", { entry: true })
    .bundle()
    .on("error", function (err) { console.log("Error: " + err.message); })
    .pipe(fs.createWriteStream("dist/hp-ml.js"))
});

gulp.task('copy', function () {
  gulp.src([
    'bower_components/three.js/three.js',
    'bower_components/webvr-polyfill/index.js',
    'bower_components/webvr-manager/index.js',
    'bower_components/threejs-vreffect/index.js',
    'bower_components/threejs-vrcontrolls/index.js',
  ])
  .pipe($.concat("deps.js"))
  .pipe(gulp.dest('dist'));

  gulp.src([
    'bower_components/polymer/polymer*',
    'src/meta-*.html',
  ])
  .pipe(gulp.dest('dist'));

  gulp.src([
    'src/hp-ml.html',
  ])
  .pipe($.rename('hp-ml.local.html'))
  .pipe(gulp.dest('dist'));

});

// TODO: somehow the gulp file doesn't run correctly and generates an almost empty hp-ml.js
gulp.task('build', [
  'copy',
  'js',
  'html'
]);

gulp.task('test', ['test:local'])

gulp.task('default', ['build'], function () {
  var watchHtml = ['src/*.html'],
    watchCopy = ['bower_components'],
    watchJs = ['src/*.*js'];

  var watchAll = watchHtml.concat(watchJs, watchCopy);

  gulp.watch(watchHtml, ['build']);
  gulp.watch(watchCopy, ['build']);
  gulp.watch(watchJs, ['build']);

})
