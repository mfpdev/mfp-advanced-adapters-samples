var express = require('express');
var http = require('http');
var request = require('request');

var app = express();
var server = http.createServer(app);
var mfpServer = "http://localhost:9080";
var port = 9081;

server.listen(port);
app.use('/', express.static(__dirname + '/public'));
console.log('::: server.js ::: Listening on port ' + port);

// Web server - serves the web application
app.get('/home', function(req, res) {
    // Website you wish to allow to connect
    res.sendFile(__dirname + '/public/index.html');
});

// Reverse proxy, pipes the requests to/from MobileFirst Server
app.use('/mfp/*', function(req, res) {
    var url = mfpServer + req.originalUrl;
    console.log('::: server.js ::: Passing request to URL: ' + url);
    req.pipe(request[req.method.toLowerCase()](url)).pipe(res);
});
