gulp    = require 'gulp'
data    = require 'gulp-data'
rename  = require 'gulp-rename'
gutil   = require 'gulp-util'
concat  = require 'gulp-concat'
pug     = require 'gulp-pug'
stylus  = require 'gulp-stylus'
buble   = require 'gulp-buble'
fm      = require 'gulp-front-matter'
marked  = require 'gulp-marked'

jeet    = require 'jeet'
axis    = require 'axis'
sync    = require 'browser-sync'
                  .create()

path    = require 'path'
fs      = require 'fs'

args  = process.argv.slice(2)
paths =
    styl:  ['./*.styl', '!./common.styl']
    pug:   ['./index.pug', './404.pug']
    appjs: ['./bot.js', './interactions.js', './index.js']
    js:    ['./*.js', '!./index.js', '!./bot.js', '!./interactions.js']
    blog:  './blog.pug'
    post:  './post.pug'
    posts: '../blog/*.md'

posts = []

gulp.task 'default', ['compile', 'watch']
gulp.task 'compile', ['compile:pug', 'compile:stylus', 'compile:js', 'compile:blog']

gulp.task 'compile:posts', ->
    layout = fs.readFileSync paths.post
    posts = []

    gulp.src paths.posts
        .pipe fm(property: 'doc', remove: true)
        .pipe marked()
        .pipe data (file) ->
            post = text: file.contents, title: file.doc.title, date: file.doc.date, name: path.basename(file.history[0], '.md')
            posts.push post
            file.contents = layout
            post
        .pipe rename (path) ->
            path.dirname += '/../src'
        .pipe pug(pretty: no)
        .pipe rename (path) ->
            path.dirname += '/../blog/' + path.basename
            path.basename = 'index'
            path.extname = '.html'
        .pipe gulp.dest('../blog')
        .pipe sync.stream()

gulp.task 'compile:blog', ['compile:posts'], ->
    gulp.src paths.blog
        .pipe data (file) -> posts: posts
        .pipe pug(pretty: no)
        .pipe rename('index.html')
        .pipe gulp.dest('../blog')
        .pipe sync.stream()

gulp.task 'compile:pug', ['compile:posts'], ->
    gulp.src paths.pug
        .pipe data (file) -> posts: posts, lastpost: posts[posts.length - 1]
        .pipe pug(pretty: no)
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'compile:stylus', ->
    gulp.src paths.styl
        .pipe stylus(compress: yes, use: [jeet(), axis()])
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'compile:appjs', ->
    gulp.src paths.appjs
        .pipe buble(transforms: { dangerousForOf: true, modules: false })
        .pipe concat('app.js')
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'compile:js', ['compile:appjs'], ->
    gulp.src paths.js
        .pipe buble(transforms: { dangerousForOf: true, modules: false })
        .pipe gulp.dest('../')
        .pipe sync.stream()

gulp.task 'watch', ->
    shouldOpen = args.indexOf('--open') isnt -1 or args.indexOf('-o') isnt -1
    shouldShare = args.indexOf('--share') isnt -1 or args.indexOf('-s') isnt -1
    shouldBeVerbose = args.indexOf('--info') isnt -1 or args.indexOf('-i') isnt -1

    sync.init(server: '..', online: shouldShare, logLevel: (if shouldBeVerbose then 'info' else 'silent'), open: shouldOpen)

    gulp.watch paths.posts, ['compile:posts', 'compile:blog', 'compile:pug']
    gulp.watch paths.post,  ['compile:posts']
    gulp.watch paths.appjs, ['compile:appjs']
    gulp.watch paths.js,    ['compile:js']
    gulp.watch paths.styl,  ['compile:stylus']
    gulp.watch paths.pug,   ['compile:pug']
    gulp.watch paths.blog,  ['compile:blog']
