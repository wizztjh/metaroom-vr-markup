var gulp = require('gulp'),
  es6ify = require('es6ify'),
  $ = require('gulp-load-plugins')();

gulp.task('html', function () {
  gulp.src('src/hp-ml.html')
    .pipe(gulp.dest('dist'));
})

gulp.task('js', function () {
  gulp.src([
    'src/hp-ml.js',
  ])
    .pipe($.plumber())
    .pipe($.browserify({
      add: [ es6ify.runtime ],
      transform: ['es6ify']
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
  gulp.src([
    'bower_components/polymer/polymer*',
    'bower_components/three.js/three.js'
  ])
  .pipe(gulp.dest('dist'));
});

gulp.task('build', ['copy', 'html', 'js']);

gulp.task('default', ['build'], function () {
  gulp.watch(['src/*.html'], ['html']);
  gulp.watch(['bower_components'], ['copy']);
  gulp.watch(['src/*.*js'], ['js']);
})
