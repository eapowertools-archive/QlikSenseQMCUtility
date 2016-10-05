var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var readLine = require('readline');
var qrsInteract = require('qrs-interact');
var config = require('./config')
var multer = require('multer');
var autoReap = require('multer-autoreap');

var qrsConfig = {
	hostname: config.qrs.hostname,
	localCertPath: config.qrs.localCertPath
};

var qrs = new qrsInteract(qrsConfig);


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(autoReap);
autoReap.options.reapOnError= true;
//router.use('/upload', express.static(config.thisServer.pluginPath + "/customproploader/uploads"));

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var destDir = path.join(config.thisServer.pluginPath, "customproploader/uploads/");
var upload = multer({ dest: destDir});
router.post('/upload', upload.array('file', 1) , function (req, res) 
{
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
 //console.log("Iam files");
  //console.log(req.files);

  	var fileStream = fs.createReadStream(req.files[0].path);
	var rl = readLine.createInterface({
		input: fileStream,
		terminal:false
	});

	var propArray =[];
	rl.on('line', function(line){
		propArray.push(line);
	});

	rl.on('close', function(){				
		res.on('autoreap', function(reapedFile)
		{
			console.log('reap file: ' + reapedFile);
		});
		res.status(200).json(propArray);
	});

});

router.get("/getProps", function(req,res)
{
	qrs.Get("custompropertydefinition/full")
	.then(function(result)
	{
		res.json(result.body)
	})
	.catch(function(error)
	{
		res.json(error);
	})
})

router.post("/create", function(req,res)
{
	var newBody = JSON.parse(JSON.stringify(req.body));
	qrs.Post("custompropertydefinition",newBody,"json")
	.then(function(result)
	{
		console.log(result.body);
		res.json(JSON.stringify(result.body));
	})
	.catch(function(error)
	{
		console.error(error);
		res.json(JSON.stringify(error));
	});
});

router.post("/update/:id", function(req, res)
{
	var newBody = JSON.parse(JSON.stringify(req.body));
	console.log(req.params.id)
	console.log(newBody);
	qrs.Put("custompropertydefinition/" + req.params.id, newBody)
	.then(function(result)
	{
		console.log(result.body);
		res.json(JSON.stringify(result.body));
	})
	.catch(function(error)
	{
		console.error(error);
		res.json(JSON.stringify(error));
	});
});


module.exports = router;