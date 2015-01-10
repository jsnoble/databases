// var express = require('express');
// var db = require('./db');

// // Middleware
// var morgan = require('morgan');
// var parser = require('body-parser');

// // Router
// var router = require('./routes.js');

// var app = express();
// module.exports.app = app;

// // Set what we are listening on.
// app.set("port", 3000);

// // Logging and parsing
// app.use(morgan('dev'));
// app.use(parser.json());

// // Set up our routes
// app.use("/classes", router);

// // Serve the client files
// app.use(express.static(__dirname + "/../client"));

// // If we are being run directly, run the server.
// if (!module.parent) {
//   app.listen(app.get("port"));
//   console.log("Listening on", app.get("port"));
// }

var http = require("http");
  var handleRequest = require("./request-handler");
  var url = require('url');
  var helpers = require("./helpers");


  var port = 3000;

  var ip = "127.0.0.1";

  var routes = {
    '/classes/chatterbox/': handleRequest.requestHandler,
    '/classes/messages': handleRequest.requestHandler,
    '/classes/room1': handleRequest.requestHandler
  };

  var server = http.createServer(function(request, response){
    console.log ("Serving request type " + request.method + " for url " + request.url);

    var parts = url.parse(request.url);
    var route = routes[parts.pathname];

    if (route){
      route(request, response);
    } else {
      helpers.sendResponse(response, "Not Found", 404);
    }

  });
  console.log("Listening on http://" + ip + ":" + port);
  server.listen(port, ip);