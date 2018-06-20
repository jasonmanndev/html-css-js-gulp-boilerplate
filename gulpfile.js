

var gulp = require('gulp'); // require gulp from node_modules folder
var sass = require('gulp-sass'); // require gulp-sass from node_modules folder
var browserSync = require('browser-sync').create(); // require browserSync
var useref = require('gulp-useref'); //collect css and js and make one file
var uglify = require('gulp-uglify'); //minify js
var gulpIf = require('gulp-if'); //only minify js
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('isthere', function() {
  console.log('Gulp is here');
});

gulp.task ('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') //**/*.scss = any scss in dir or sub-dir
    .pipe(sass()) //using gulp-sass
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
      //setting interlaced to true
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('cache:clear', function(callback) {
  return cache.clearAll(callback);
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
  .pipe(useref()) //minifies only if it is a js file
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  // Other watchers
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})



//https://css-tricks.com/gulp-for-beginners/
