gulp    = require 'gulp'
gutil   = require 'gulp-util'
concat  = require 'gulp-concat'
jeet    = require 'jeet'
pug     = require 'gulp-pug'
stylus  = require 'gulp-stylus'
buble   = require 'gulp-buble'
sync    = require 'browser-sync'
                  .create()

args = process.argv.slice(2)

gulp.task 'default', ['compile', 'watch']
gulp.task 'compile', ['compile:pug', 'compile:stylus', 'compile:js']

gulp.task 'compile:pug', ->
    gulp.src './index.pug'
        .pipe pug(pretty: no)
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'compile:stylus', ->
    gulp.src './index.styl'
        .pipe stylus(compress: yes, use: jeet())
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'compile:js', ->
    gulp.src './*.js'
        .pipe buble(transforms: { dangerousForOf: true, modules: false })
        .pipe concat('app.js')
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'watch', ->
    shouldOpen = args.indexOf('--open') isnt -1 or args.indexOf('-o') isnt -1
    shouldShare = args.indexOf('--share') isnt -1 or args.indexOf('-s') isnt -1
    shouldBeVerbose = args.indexOf('--info') isnt -1 or args.indexOf('-i') isnt -1

    sync.init(server: '..', online: shouldShare, logLevel: (if shouldBeVerbose then 'info' else 'silent'), open: shouldOpen)

    gulp.watch './*.js',       ['compile:js']
    gulp.watch './index.styl', ['compile:stylus']
    gulp.watch './index.pug',  ['compile:pug']
