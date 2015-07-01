var gulp = require('gulp'),
  browserify = require('browserify');
  babelify = require('babelify')
  fs = require('fs')
  $ = require('gulp-load-plugins')(),
  Vulcanize = require('vulcanize');

require('web-component-tester').gulp.init(gulp);

gulp.task('html', ['copy','js'], function () {
  console.log(
    gulp.src('dist/mr-ml.local.html')
      .pipe($.vulcanize({
        abspath: '',
        excludes: [],
        stripExcludes: false
      }))
  )
  gulp.src('dist/mr-ml.local.html')
    .pipe($.vulcanize({
      abspath: '',
      excludes: [],
      stripExcludes: false
    }))
    .pipe($.rename('mr-ml.html'))
    .pipe(gulp.dest('dist'))
    .on("error", function (err) { console.log("Error: " + err.message); })
})

gulp.task('js', function () {
  browserify({ debug: true })
    .transform(babelify)
    .require("./src/game-object.js", { entry: true })
    .bundle()
    .on("error", function (err) { console.log("Error: " + err.message); })
    .pipe(fs.createWriteStream("dist/game-object.js"))
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

gulp.task('copy',['copy:depsjs', 'copy:webComponents', 'copy:metaroomMarkup'])

gulp.task('build', ['html'])

gulp.task('test', ['test:local'])

gulp.task('default', ['build'], function () {
  gulp.watch(['src/*.*js', 'src/*.html', 'bower_components'], ['build']);
})
