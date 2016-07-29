'use strict';
/**
 * フラグ用変数
 * デフォルトで動作させる場合はtrueをセット
 */
let flg_php  = false;
let flg_jade = false;
let flg_min  = false;

/**
 * 環境設定
 */
const CONFIG = {
  outputDirectory: {
    dev : './src/',
    release : './release/',
  },
  sourceDirectory: {
    sass : './src/**/*.scss',
    jsLib : './src/assets/js/libs/**/*.js',
    js : './src/assets/js',
    es6 : './src/**/*.es6',
    jade : './src/**/*.jade',
    jadeNone : './src/**/_*.jade',
  },
  watchDirectory: {
    html : './src/**/*.html',
    jade : './src/**/*.jade',
    css : './src/**/*.css',
    php : './src/**/*.php',
    sass : './src/**/*.scss',
  },
  deployFile: [
    './src/**',
    '!./src/assets/js/libs/*.js',
    '!./src/**/*.scss',
    '!./src/**/*.jade',
    '!./src/**/*.es6'
  ],
  cleanFile: [
    './release/**/libs',
  ]
};
const SASS_AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ios >= 7',
  'android >= 2.3',
  'last 4 versions'
];
const SASS_OUTPUT_STYLE = "expanded"; //nested, compact, compressed, expanded.

/**
 * IMPORT MODULES
 */
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import fs from 'fs';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import pleeease from 'gulp-pleeease';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import connectPhp from 'gulp-connect-php';
import uglify from 'gulp-uglify';
import header from 'gulp-header';
import eslint from 'gulp-eslint';
import htmlhint from 'gulp-htmlhint';
import jade from 'gulp-jade';
import gulpIf from 'gulp-if';
import browserSync from 'browser-sync';
import minimist from 'minimist';
const RELOAD = browserSync.reload;

/**
 * DEFAULT TASKS
 */
gulp.task('sass', () => {
  gulp.src(CONFIG.sourceDirectory.sass)
  .pipe(plumber())
  .pipe(sass({outputStyle: SASS_OUTPUT_STYLE}))
  //.pipe(concat('min.css'))
  .pipe(pleeease({
    autoprefixer: {'browsers': SASS_AUTOPREFIXER_BROWSERS},
    minifier: false
  }))
  //.pipe(header('@charset 'utf-8';\n'))
  .pipe(gulp.dest(CONFIG.outputDirectory.dev))
  .pipe(browserSync.reload({stream:true}));
});
gulp.task('eslint', () => {
  return gulp.src([CONFIG.sourceDirectory.es6])
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
  return gulp.src([CONFIG.sourceDirectory.es6])
  .pipe(plumber())
  .pipe(babel())
  //.pipe(concat('min.js'))
  .pipe(gulpIf( flg_min, uglify({preserveComments: 'some'}) ) )
  .pipe(gulp.dest(CONFIG.outputDirectory.dev))
  .pipe(browserSync.reload({stream:true}));
});
gulp.task('htmllint', () => {
  return gulp.src([CONFIG.watchDirectory.html])
  .pipe(plumber())
  .pipe(htmlhint('.htmlhintrc'))
  .pipe(htmlhint.reporter())
});
gulp.task('jadehtml', function() {
  return gulp.src([CONFIG.sourceDirectory.jade,'!'+CONFIG.sourceDirectory.jadeNone])
  .pipe(plumber())
  .pipe(jade({
    pretty: true
    //client: true //output to javascript
  }))
  .pipe(gulp.dest(CONFIG.outputDirectory.dev))
});
gulp.task('js', () => {
  gulp.src([CONFIG.sourceDirectory.jsLib])
  .pipe(plumber())
  .pipe(concat('libs.js'))
  .pipe(gulpIf( flg_min, uglify({preserveComments: 'some'}) ) )
  .pipe(gulp.dest(CONFIG.sourceDirectory.js))
  .pipe(browserSync.reload({stream:true}));
});
gulp.task('reload', () => {
  gulp.src().pipe(browserSync.reload({stream:true}));
});
gulp.task('watch',['server'], () => {
  gulp.watch(CONFIG.watchDirectory.es6,['babel']);
  gulp.watch(CONFIG.watchDirectory.sass,['sass']);
  gulp.watch(CONFIG.watchDirectory.html,['htmllint']);
  if(flg_jade){
    gulp.watch(CONFIG.watchDirectory.jade,['jadehtml']);
  }
});
gulp.task('server', () => {
  if(flg_php){
    //Use php
    connectPhp.server({
      port: 8000,
      base: CONFIG.outputDirectory.dev
    }, function (){
      browserSync({
        proxy: 'localhost:8000'
      });
    });
  } else {
    //Use html only
    browserSync({
      server: {
        baseDir: CONFIG.outputDirectory.dev,
      },
      notify: true,
      logPrefix: 'browserSync',
      // https: true,
    })
  };
  gulp.watch(CONFIG.watchDirectory.html, RELOAD);
  if(flg_php){
    gulp.watch(CONFIG.watchDirectory.php, RELOAD);
  }
});
gulp.task('default', (callback) => {
  let env = minimist(process.argv.slice(2));
  console.log('$ gulp --[pc or sp] --[php] --[jade] --[min]');
  Object.keys(env).forEach(function (key) {
    console.log("key -> " + key + "  value -> " + env[key]);
    switch(key){
      case 'php': flg_php = true;
        break;
      case 'jade': flg_jade = true;
        break;
      case 'min': flg_min = true;
        break;
    }
  });
  if(flg_jade) {
    return runSequence(['sass','babel'],'js','jadehtml','watch',callback);
  } else {
    return runSequence(['sass','babel'],'js','watch',callback);
  }
});

/**
 * RELEASE TASKS
 */
gulp.task('deploy', () => {
  return gulp.src(CONFIG.deployFile,{
      base:CONFIG.outputDirectory.src
    })
     .pipe(gulp.dest(CONFIG.outputDirectory.release))
});
gulp.task('clean', () => {
  return del(CONFIG.cleanFile).then(paths => {
      console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});
gulp.task('release', (callback) => {
  return runSequence(['sass','babel'],'js','jadehtml','deploy','clean',callback);
});
