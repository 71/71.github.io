// Core: Accord + Gulp (+ Utils) + Minimist
var minimist = require('minimist');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var glive = require('gulp-server-livereload');

// Misc
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var tsc = require('gulp-typescript');
var rename = require('gulp-rename');
var jeet = require('jeet');

var options = minimist(process.argv.slice(2), {
    string: ['lang'],
    boolean: ['dev', 'lr'],
    default: {
        lr: true,
        dev: true || process.env.NODE_ENV == 'development',
        lang: 'en'
    }
});

function getLocals () {
    var obj = JSON.parse(fs.readFileSync('./src/' + options.lang + '.json'));
    obj.dev = options.dev;
    return obj;
};

gulp.task('default', ['compile', 'watch'], function () {
    return
    gulp.src('./out')
        .pipe(glive({
            livereload: options.lr
        }));
});

gulp.task('watch', function () {
    gulp.watch('./src/*.jade', ['jade']);
    gulp.watch('./src/*.styl', ['stylus']);
    gulp.watch('./src/*.ts', ['typescript']);
});

gulp.task('compile', ['stylus', 'typescript', 'jade']);

gulp.task('stylus', function () {
    return gulp.src('./src/app.styl')
        .pipe(stylus({ compress: !options.dev, use: jeet() }))
        .pipe(gulp.dest('./out'));
});

gulp.task('jade', function () {
    return gulp.src('./src/index.jade')
        .pipe(jade({ pretty: options.dev, locals: getLocals() }))
        .pipe(gulp.dest('./out'));
});

gulp.task('typescript', function () {
    return gulp.src('./src/*.ts')
        .pipe(tsc({ outFile: 'app.js', removeComments: true }))
        .pipe(gulp.dest('./out'));
});
