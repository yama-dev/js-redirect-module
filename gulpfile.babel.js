'use strict';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import fs from 'fs';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import pleeease from 'gulp-pleeease';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import eslint from 'gulp-eslint';
import gulpIf from 'gulp-if';
import browserSync from 'browser-sync';
import minimist from 'minimist';
const reload = browserSync.reload;
const DevDir = './src/',
  ReleaseDir = './release/',
  SassDir = './src/**/*.scss',
  JsLibsDir = './src/assets/js/libs/**/*.js',
  JsDir = './src/assets/js',
  TypeDir = './src/**/*.ts',
  Es6Dir = './src/**/*.es6',
  HtmlWatchdir = './src/**/*.html',
  CssWatchdir = './src/**/*.css',
  PhpWatchdir = './src/**/*.php',
  SassWatchdir = './src/**/*.scss';

//default task ->
gulp.task('sass', () => {
  gulp.src(SassDir)
  .pipe(plumber())
  .pipe(sass({outputStyle: 'expanded'})) //nested, compact, compressed, expanded.
  //.pipe(concat('concat.css'))
  .pipe(pleeease({
    autoprefixer: {'browsers': ['last 4 versions','ie 8', 'ios 7','Android 2.3']},
    minifier: false
  }))
  .pipe(gulp.dest(DevDir))
  .pipe(browserSync.reload({stream:true}));
});
gulp.task('eslint', () => {
  return gulp.src([Es6Dir])
  .pipe(plumber())
  .pipe(eslint({
    globals: {
      $: true,
      'jQuery':true
    }
  }))
  .pipe(eslint.format())
});
gulp.task('babel',['eslint'], () => {
  return gulp.src([Es6Dir])
  .pipe(plumber())
  .pipe(babel())
  //.pipe(concat('concat.js'))
  //.pipe(uglify({preserveComments: 'some'}))
  .pipe(gulp.dest(DevDir))
  .pipe(browserSync.reload({stream:true}));
});
gulp.task('js', () => {
  gulp.src([JsLibsDir])
  .pipe(plumber())
  .pipe(concat('libs.js'))
  //.pipe(uglify({preserveComments: 'some'}))
  .pipe(gulp.dest(JsDir))
  .pipe(browserSync.reload({stream:true}));
});
gulp.task('reload', () => {
  gulp.src().pipe(browserSync.reload({stream:true}));
});
gulp.task('watch',['server'], () => {
  gulp.watch(Es6Dir,['babel']);
  gulp.watch(SassWatchdir,['sass']);
});
gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: DevDir
    }
  });
  gulp.watch(HtmlWatchdir, reload);
  gulp.watch(PhpWatchdir, reload);
});
gulp.task('default', (callback) => {
  let env = minimist(process.argv.slice(2));
  console.log('$ gulp --[pc or sp] --[filename] // 拡張子無し');
  console.log(env);
  return runSequence(['sass','babel'],'js','watch',callback);
});
//default task

//release task ->
gulp.task('deploy', () => {
  gulp.src(['./src/**','!./src/assets/js/libs/*.js','!./src/**/*.scss','!./src/**/*.es6'],
   {base:'src'})
   .pipe(gulp.dest('release'))
});
gulp.task('clean', (cb) => {
  del(['./release/**/libs'], cb);
});
gulp.task('release', (callback) => {
  let env = minimist(process.argv.slice(2));
  console.log('$ gulp --[pc or sp] --[filename] // 拡張子無し');
  console.log(env);
  return runSequence(['sass','babel'],'js','deploy','clean',callback);
});
//release task
