var fs = require('fs')
var data = fs.readFileSync('./src/data/md.txt').toString().replace(/`/g, '\\`')
console.log(data)

fs.writeFile('./src/data/md.js', data)