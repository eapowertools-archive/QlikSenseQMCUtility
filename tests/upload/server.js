var express = require('express');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.log(path.join(__dirname, '/../..'));

app.use('/root', express.static(path.join(__dirname, '/../..')));
app.use('/tests', express.static(path.join(__dirname)));

app.get('/', function(req, res)
{
    res.sendfile(path.join(__dirname,'upload.html'));
})

var upload = multer({ dest: path.join(__dirname, 'upload/') });
app.post('/upload', upload.array('file', 1) , function (req, res) 
{
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
 console.log("Iam files");
  console.log(req.files);

    upload(req, res, function(err)
	{
		if(err)
		{
			res.json(err);
		}
		console.log('uploading');
		console.log('length: ' + req.files.length);
		console.log('path: ' + req.files[0].path);

		var obj = {};

		obj.length = req.files[0].length;
		obj.path = req.files[0].path;
		obj.fieldName = req.files[0].fieldname;
		obj.originalName = req.files[0].originalname;
    });

});


app.listen(8432, function()
{
	console.log('Running web server on port 8432');
});