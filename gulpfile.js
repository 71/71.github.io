// Core: Accord + Gulp (+ Utils) + Minimist
var minimist = require('minimist');
var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');

// Misc
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var tsc = require('gulp-typescript');
var rename = require('gulp-rename');
var jeet = require('jeet');
var ghPages = require('gulp-gh-pages');

var options = minimist(process.argv.slice(2), {
    string: ['lang', 'msg'],
    boolean: ['dev'],
    default: {
        dev: true || process.env.NODE_ENV == 'development',
        lang: 'en',
        msg: 'Automatically pushed'
    }
});

function getLocals () {
    var obj = JSON.parse(fs.readFileSync('./src/' + options.lang + '.json'));
    obj.dev = options.dev;
    obj.lang = options.lang;
    return obj;
};

gulp.task('default', ['compile', 'watch']);

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

gulp.task('generate-background-svg', function () {
    return gulp.src('./src/bg.jade')
        .pipe(jade({ pretty: options.dev }))
        .pipe(rename({ dirname: './img', extname: '.svg' }))
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

gulp.task('publish', function () {
    return gulp.src('./out/**/*').pipe(ghPages({ message: options.msg }));
});

gulp.task('clean', function () {
    return del('./.publish/**');
});

gulp.task('deploy', ['publish', 'clean']);
