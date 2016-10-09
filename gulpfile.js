/*
 * gulpfile.js - https://github.com/joshukraine/middleman-gulp
 *
 * This Gulp build system is designed for use with Middleman and is organized
 * into four main sections:
 * 1. Plugins
 * 2. Configuration
 * 3. Worker Tasks
 * 4. Super Tasks
 *
 */

'use strict'; // http://www.w3schools.com/js/js_strict.asp

// 1. PLUGINS
// This is where we require Gulp itself and our other dependencies.

var gulp       = require('gulp');
var imagemin   = require('gulp-imagemin');
var changed    = require('gulp-changed');
var del        = require('del');
var sass       = require('gulp-sass');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');

// 2. CONFIGURATION
// This is where we set various paths, options, and other configs for use in
// later tasks

var
  src  = 'source/', // The Middleman source folder
  dest = '.tmp/',   // The "hot" build folder used by Middleman's external pipeline

  css = {
    in: src + 'stylesheets/**/*.{css,scss,sass}',
    out: dest + 'stylesheets/',
  },

  js = {
    in: src + 'javascripts/*.{js,coffee}',
    out: dest + 'javascripts/'
  },

  images = {
    in: src + 'images/*.*',
    out: dest + 'images/'
  };

// 3. WORKER TASKS
// This is where we define individual tasks that perform focused operations.

// CSS Preprocessing
gulp.task('css', function() {
  return gulp.src(css.in)
    .pipe(sass())
    .pipe(gulp.dest(css.out));
});

// Javascript Bundling
gulp.task('js', function() {
  var b = browserify({
    entries: src + 'javascripts/all.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(js.out));
});

// Image Optimization
gulp.task('images', function() {
  return gulp.src(images.in)
    .pipe(changed(images.out))
    .pipe(imagemin())
    .pipe(gulp.dest(images.out));
});

// Clean .tmp/
gulp.task('clean', function() {
  del([
    dest + '*'
  ]);
});

// 4. SUPER TASKS
// These are tasks which call collections of worker tasks.

// Watch Task
gulp.task('watch', function() {

  gulp.watch(css.in, ['css']);
  gulp.watch(js.in, ['js']);
  gulp.watch(images.in, ['images']);

});

// Development Task
// This task runs all the tasks that should be active with Middleman's external
// pipeline during site development.
gulp.task('development', ['css', 'js', 'images']);

// Build Task
// This task runs all the tasks needed for Middleman to build the site for
// deployment to production.
gulp.task('build', ['css', 'js', 'images', 'html']);

// Default Task
// This is the task that will be invoked by Middleman's exteranal pipeline when
// running 'middleman server'
gulp.task('default', ['development', 'watch']);
