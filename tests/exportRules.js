var fs = require('fs');

var srcInfo = fs.readFileSync('./srcRules.json',{encoding:'utf8'});

console.log(srcInfo);

var destFile = fs.createWriteStream('./rules.json',{defaultEncoding:'utf8'});

destFile.on('finish', function()
{
    console.log('File Done!');
})

destFile.write(srcInfo);
destFile.end();