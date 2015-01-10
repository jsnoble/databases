var helpers = require("./helpers");
  var mysql = require('mysql');
  var sequelize = require("sequelize");
  

  var seq = new sequelize('chat', 'root', null ,{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
  seq
    .authenticate()
    .complete(function(err){
      if(!!err){
        console.log('failed to connect to db')
      } else{
        console.log('all ready to rumble')
      }
    });

  var message = seq.define('message', {
    username: sequelize.STRING,
    text: sequelize.STRING,
    roomname: sequelize.STRING
    });

  seq
    .sync()
    .complete(function(err){
      if(err){
        console.log('this is the error: '+err)
      } else{
        console.log('table created')
      }
    });

  //message.create({
  //  username : 'jared' ,
  //  text : 'this works' ,
  //  roomname : 'lobby'
  //});

  var actions = {
    "GET": function(request, response){
      message
        .findAll()
        .complete(function(err, data){
          if(err){
            console.log(err);
          } else if(data === undefined){
            message.create({
              username : 'jared' ,
              text : 'this works' ,
              roomname : 'lobby'
            });
            var arr = [{username: 'jared', text:'this works', roomname:'lobby'}];
            helpers.sendResponse (response , {results : arr});
          }else{
            helpers.sendResponse (response , {results : data});
          }
        });
      },
    "POST": function(request, response){
      helpers.collectionData(request, function(mesg){
        message.create({
           username  : mesg.username,
           text  : mesg.text,
           roomname: mesg.roomname
        }).complete(
          function(err, usr) {
            if (err) {
              console.log (err)
            } else {
              helpers.sendResponse (response , null , 201)
            }
          });




      });
    },
    "OPTIONS": function(request, response){
      helpers.sendResponse(response, null);
    }
  };


  exports.requestHandler = function(request, response) {
    var action = actions[request.method];
      if (action) {
        action(request, response);
      } else {
        helpers.sendResponse(response , 'Not Found' , 404);
      }
    };
