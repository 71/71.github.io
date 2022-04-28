fs     = require 'fs'
pug    = require 'pug'
stylus = require 'stylus'

exports.build = ->
  style = fs.readFileSync './index.styl', 'utf-8'

  stylus style
    .set 'filename', __dirname + '/index.styl'
    .render (err, css) ->
      fs.writeFileSync '../index.css', css

  fs.writeFileSync '../index.html', pug.renderFile 'index.pug'
