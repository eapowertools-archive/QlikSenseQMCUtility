var http = require('http');
var express = require('express');
var qrsInteract = require('qrs-interact');

var app = express();
var qrs = new qrsInteract("localhost");

//app.use(express.cookieParser());
//app.use(express.bodyParser());


/*app.get("/resource/font", function (req, res) {
    res.sendfile('qlikview-sans.svg');
});

app.get("/resource/icon", function (req, res) {
    res.sendfile("users.png");
});

app.get("/resource/qv", function (req, res) {
    res.sendfile("QlikLogo-RGB.png");
});*/

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/public/index.htm');
});

app.get("/resource/background", function (req, res) {
    res.sendFile("ConnectingCircles-01.png");
});

app.get("/js/prism.js", function (req, res) {
    res.sendFile(__dirname + '/public/js/prism.js');
});

app.get("/js/leonardo-ui.js", function (req, res) {
    res.sendFile(__dirname + '/public/js/leonardo-ui.js');
});

app.get("/leonardo-ui.css", function (req, res) {
    res.sendFile(__dirname + '/public/leonardo-ui.css');
});

app.get("/prism.css", function (req, res) {
    res.sendFile(__dirname + '/public/prism.css');
});

app.get("/style.css", function (req, res) {
    res.sendFile(__dirname + '/public/style.css');
});

app.get("/Promote.htm", function (req, res) {
    res.sendFile(__dirname + '/public/Promote.htm');
});

app.get('/getsheets', function (req, res) {

    console.log("Query sheets");
    //console.log(req);
    //console.log(res);
    
    var filter = "((objectType+eq+%27sheet%27))";
    //if (req.query.search != null) filter += " and name so '" + req.query.search + "'";
    if (req.query.search != null) filter += " and (name so '" + req.query.search + "' or app.name so '" + req.query.search + "')";
    console.log(filter);
    
    var tablebody = '{ "entity": "App.Object", "columns": [{ "name": "id", "columnType": "Property", "definition": "id" }, { "name": "privileges", "columnType": "Privileges", "definition": "privileges" }, { "name": "name", "columnType": "Property", "definition": "name" }, { "name": "objectType", "columnType": "Property", "definition": "objectType" }, { "name": "owner", "columnType": "Property", "definition": "owner" }, { "name": "approved", "columnType": "Property", "definition": "approved" }, { "name": "published", "columnType": "Property", "definition": "published" }, { "name": "modifiedDate", "columnType": "Property", "definition": "modifiedDate" }, { "name": "app.name", "columnType": "Property", "definition": "app.name" }, { "name": "app.stream.name", "columnType": "Property", "definition": "app.stream.name" }, { "name": "tags", "columnType": "List", "definition": "tag", "list": [{ "name": "name", "columnType": "Property", "definition": "name" }, { "name": "id", "columnType": "Property", "definition": "id" }] }] }';
    qrs.Post("app/object/table?filter=" + filter + "&orderAscending=true&skip=0&sortColumn=name", JSON.parse(tablebody), 'json')
        .then(function (result) {
            //console.log(result);

            var s = JSON.stringify(result);
            res.send(s);
        })
        .catch(function (error) {
            console.log(error);
        });
});

function appobject(id, field, value) {
    if (id != "") {

        console.log("Changing App object with id: " + id + ", field: " + field + ", value: " + value);

        var d = new Date();
        var n = d.toISOString();

        //var body = '{ "modifiedDate":"2016-07-21T22:27:09.024Z", "' + field + '":' + value + '}';
        var body = '{ "modifiedDate":"' + n + '", "' + field + '":' + value + '}';
        qrs.Put("app/object/" + id, JSON.parse(body), 'json')
            .then(function (result) {

                var s = JSON.stringify(result);
                return s;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

app.post('/approve', function (req, res) {
    var id = req.query.id;
    var s = appobject(id, "approved", true);
    res.send(s);
});

app.post('/unapprove', function (req, res) {
    var id = req.query.id;
    var s = appobject(id, "approved", false);
    res.send(s);
});

app.post('/publish', function (req, res) {
    var id = req.query.id;
    var s = appobject(id, "published", true);
    res.send(s);
});

app.post('/unpublish', function (req, res) {
    var id = req.query.id;
    var s = appobject(id, "published", false);
    res.send(s);
});


http.createServer(app).listen(8186);

/*
https://masterlib.112adams.local:4242/qrs/app/object/full?xrfkey=ABCDEFG123456789&filter=name eq 'testApprovalSheet'

grabbed my sheet
found the id
then do a put to:
https://masterlib.112adams.local:4242/qrs/app/object/1602652f-d9b2-4823-9321-89001f2b0a64?xrfkey=ABCDEFG123456789

with body {
   "modifiedDate":"2016-05-16T22:27:09.024Z",
   "approved":true
}
boom, object approved, refresh page it shows up in base sheets
*/







