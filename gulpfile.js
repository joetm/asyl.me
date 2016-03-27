var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    //sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    //less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    //del = require('del'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    //plumber = require('gulp-plumber'),
    cssprefix = require('gulp-css-prefix'),
    jslint = require('gulp-jslint-simple');
    //jshint = require('gulp-jshint');
    //jslint = require('gulp-jslint');

var requirejsOptimize = require('gulp-requirejs-optimize');


//jslint
gulp.task('jslint', function () {
    gulp.src([
        'js/**/*.js' //,          //include
        //'!js/**/*.min.js',  //exclude
    ])
    //.pipe(plumber())
    .pipe(jslint.run({
        browser: true,
        devel: true
    }))
    .pipe(jslint.report({
        // example of using a JSHint reporter
        //add a beep for jslint with gutil
        //reporter: function (a) { gutil.beep(); var rep = require('jshint-stylish').reporter; rep(a); }
        reporter: require('jshint-stylish').reporter
    }));
});

//js
gulp.task('js', function() {
    return gulp.src(
        [
            'js/**/*.js',               // '!frontend/js/*.min.js'
            './vendor/doT/doT.min.js'
        ]
    )
    .pipe(requirejsOptimize())
    //.pipe(sourcemaps.init())
    .pipe(uglify())
    //.pipe(concat('scripts.min.js'))
    //.pipe(sourcemaps.write('prod/js'))
    .pipe(gulp.dest('prod/js/scripts.min.js'));
});

//css
gulp.task('css', function () {
  gulp.src([
    'vendor/bootstrap/dist/css/bootstrap.min.css',
    'vendor/leaflet/dist/leaflet.css',
    'css/*.scss'
  ])
    //.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('prod/css'));
});


/**********tasks***********/

gulp.task('build', ['css', 'jslint', 'js']);

//watch
gulp.task('watch', ['jslint', 'js', 'css'], function () {

    //css
    gulp.watch([
        "./css/**/*.css",
        "./css/**/*.scss",
        "./css/**/*.less"
    ], ['css']);

    //js
    gulp.watch(["./js/**/*.js"], ['jslint', 'js']);

});//gulp.task('watch'