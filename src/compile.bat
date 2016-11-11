@ECHO	OFF
REM	NPM	i -g pug-cli stylus coffee-script

STYLUS index.styl -o ..>nul & PUG index.pug -o ..>nul & COFFEE -o .. -c index.coffee>nul
