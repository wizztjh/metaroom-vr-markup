var gulp = require('gulp'),
  browserify = require('browserify');
  babelify = require('babelify')
  fs = require('fs')
  $ = require('gulp-load-plugins')();

require('web-component-tester').gulp.init(gulp);

gulp.task('html', ['js', 'copy'], function () {
  gulp.src('dist/mr-ml.local.html')
    .pipe($.vulcanize({
      abspath: '',
      excludes: [],
      stripExcludes: false
    }))
    .on("error", function (err) { console.log("Error: " + err.message); })
    .pipe($.rename('mr-ml.html'))
    .pipe(gulp.dest('dist'));
})

gulp.task('js', function () {
  browserify({ debug: true })
    .transform(babelify)
    .require("./src/game-object.js", { entry: true })
    .bundle()
    .on("error", function (err) { console.log("Error: " + err.message); })
    .pipe(fs.createWriteStream("dist/game-object.js"))
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
    'src/left-wall.html',
  ])
  .pipe(gulp.dest('dist'));

  gulp.src([
    'src/mr-ml.html',
  ])
  .pipe($.rename('mr-ml.local.html'))
  .pipe(gulp.dest('dist'));

});

gulp.task('build', ['copy', 'js', 'html']);

gulp.task('test', ['test:local'])

gulp.task('default', ['build'], function () {
  gulp.watch(['src/*.*js', 'src/*.html', 'bower_components'], ['build']);
})
