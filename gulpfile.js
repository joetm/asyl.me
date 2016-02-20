var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    //batch = require('gulp-batch'),
    //sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    //less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    //clean = require('gulp-clean'), //deprecated in favor of del
    //del = require('del'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    //jshint = require('gulp-jshint');
    //jslint = require('gulp-jslint');
    jslint = require('gulp-jslint-simple');


gulp.task('jslint', function () {
    gulp.src([
        'app/**/*.js'
    ])
    .pipe(jslint.run({
        node: true,
        nomen: true,
        vars: true,
        unparam: true,
        errorsOnly: false
    }))
    .pipe(jslint.report({
        //add a beep for jslint with gutil
        //reporter: function (a) { gutil.beep(); var rep = require('jshint-stylish').reporter; rep(a); }
        reporter: require('jshint-stylish').reporter
    }));
});

gulp.task('compressjs', function () {
    return gulp.src([
        'static/js/jquery.min.js',
        'static/js/leaflet.1.0.js',
        'static/js/leaflet.curve.js',
        'static/js/shp.min.js',
        'static/js/leaflet.shpfile.js',
        //'static/js/globalize.js',
        //'static/js/globalize/message.js',
        'app/main.js'
    ])
    .pipe(concat('scripts.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('static/js/'));
});

gulp.task('compresscss', function () {
  return gulp.src([
        'static/css/leaflet.css',
        'static/css/screen.css'
    ])
    .pipe(concat('styles.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('static/css/'));
});


/**********tasks***********/
gulp.task('css', ['compresscss']);
gulp.task('js', ['compressjs']);
gulp.task('build', ['css', 'js']);
gulp.task('default', ['css', 'js']);
//watch
gulp.task('watch', ['compressjs', 'compresscss'], function () {
    gulp.watch([
        "./app/*.js"
    ], ['compressjs']);
    gulp.watch([
        "./static/css/**/*.css"
    ], ['compresscss']);
});
