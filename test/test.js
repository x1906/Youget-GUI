var fs = require('fs');

var text = fs.readFileSync('test/text.txt', 'utf-8');

console.log(text.replace(/((.|\n)*Downloading\s+)|(\n+.*)/g, ''));
