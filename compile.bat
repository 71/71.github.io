@ECHO	OFF
REM	NPM	i -g pug-cli stylus coffee-script

STYLUS index.styl -o build>nul & PUG index.pug -o build>nul & COFFEE -o build -c index.coffee>nul
