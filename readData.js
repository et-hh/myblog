var fs = require('fs')
var data = fs.readFileSync('./src/data/md.txt').toString().replace(/`/g, '\\`')


fs.writeFile('./src/data/md.js', data)