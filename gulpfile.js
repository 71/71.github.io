var fs = require('fs');

var gulp = require('gulp');
var gjade = require('gulp-jade');
var glr = require('gulp-server-livereload');
var gutil = require('gulp-util');

var babel = require('babel-core');
var jade = require('jade');
var stylus = require('stylus');
var jeet = require('jeet');
var marked = require('marked');
var minimist = require('minimist');

var options = minimist(process.argv.slice(2), {
    string: ['dev'],
    boolean: ['lang', 'lr'],
    default: {
        lr: true,
        dev: process.env.NODE_ENV == 'development',
        lang: 'en'
    }
});

// Jade filters
jade.filters.babel = function (str) {
    return babel.transform(str, {
        presets: ['es2015'],
    	babelrc: false,
    	compact: true,
    	comments: false
    }).code;
};

jade.filters.stylus = function (str) {
    var css;
    stylus(str)
        .use(jeet())
    	.render(function (err, _css) { css = _css });
    return css;
};

jade.filters.marked = function (str) {
    return marked(str);
};

var getLang = function () {
    var obj = JSON.parse(fs.readFileSync('./src/' + options.lang + '.json', 'utf8')) || {};
    obj.dev = options.dev;
    return obj;
};

// Misc functions
gulp.task('default', ['watch', 'jade'], function () {
    gulp.src('./build')
        .pipe(glr({
            livereload: options.lr,
            open: options.lr,
            defaultFile: 'app.html'
        }));
});

gulp.task('jade', function () {
    return gulp.src('./src/*.jade')
        .pipe(gjade({ jade: jade, locals: getLang() }))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
    gulp.watch('./src/*', ['jade']);
});
