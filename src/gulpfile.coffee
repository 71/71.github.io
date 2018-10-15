gulp    = require 'gulp'
buble   = require 'gulp-buble'
pug     = require 'gulp-pug'
stylus  = require 'gulp-stylus'

axis    = require 'axis'
jeet    = require 'jeet'
sync    = require 'browser-sync'
                  .create()


args  = process.argv.slice(2)
paths =
    styl:  ['./style/index.styl', './style/404.styl']
    pug:   ['./views/index.pug',  './views/404.pug']
    js:    './scripts/*.js'

lang = (
    langidx = args.indexOf('--lang')
    
    if langidx is -1
        langidx = args.indexOf('-l')
    
    if langidx is -1
        'en'
    else
        args[langidx + 1]
)


gulp.task 'default', ['compile', 'watch']
gulp.task 'compile', ['compile:pug', 'compile:styl', 'compile:js']

gulp.task 'compile:pug', ->
    gulp.src paths.pug
        .pipe pug(pretty: no, locals: { language: lang })
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'compile:styl', ->
    gulp.src paths.styl
        .pipe stylus(compress: yes, use: [jeet(), axis()])
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'compile:js', ->
    gulp.src paths.js
        .pipe buble(transforms: { dangerousForOf: true, modules: false })
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'watch', ->
    shouldOpen      = args.indexOf('--open')  isnt -1 or args.indexOf('-o') isnt -1
    shouldShare     = args.indexOf('--share') isnt -1 or args.indexOf('-s') isnt -1
    shouldBeVerbose = args.indexOf('--info')  isnt -1 or args.indexOf('-i') isnt -1

    sync.init(server: '..', online: shouldShare, logLevel: (if shouldBeVerbose then 'info' else 'silent'), open: shouldOpen)

    gulp.watch paths.js,    ['compile:js']
    gulp.watch paths.styl,  ['compile:styl']
    gulp.watch paths.pug,   ['compile:pug']

    gulp.watch './views/layout.pug',   ['compile:pug']
    gulp.watch './style/common.styl',  ['compile:styl']
