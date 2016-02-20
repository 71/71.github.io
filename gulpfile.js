var gulp = require('gulp');
var jade = require('jade');
var stylus = require('stylus');
var gutil = require('gulp-util');

// Jade filters
jade.filters.typescript = function (str) {
    
};

jade.filters.stylus = function (str) {
    var css;
    stylus.render(str, { }, function (err, _css) {
        css = _css;
    });
    return css;
};

// Misc functions
var renderJade = function (filename, string) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        string = jade.renderFile(filename);
        this.push(new gutil.File({ cwd: "", base: "", path: "index.html", contents: new Buffer(string) }));
        this.push(null);
    };
    return src;
};

gulp.task('default', ['jade'], function () {
    
});

gulp.task('jade', function () {
    return renderJade('src/app.jade').pipe(gulp.dest('build'));
});
