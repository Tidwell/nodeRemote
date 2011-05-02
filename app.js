/**
 * Module dependencies.
 */

var http = require('http');
var sys = require('sys')

var express = require('express');
var io = require('socket.io')

var app = express.createServer();
app.use(express.static(__dirname + '/public'));

var remote = require('./npmRemote');

//Listen with express
if (!module.parent) {
  app.listen(8080);
  console.log("Express server listening on port %d", app.address().port);
}

//now we can create our socket connection for the clients
var socket = io.listen(app); 
socket.on('connection', function(client){ 
  // new client is here! 
  client.on('message', function(args){
    if (!args || !args.command) {
      throw new Error('Badly formatted command');
      
    }
    else if (remote[args.command]) {
      remote[args.command](socket, args.args);
    }
    else {
      throw new Error('Unknown command sent');
    }
  }) 
  client.on('disconnect', function(){
    //console.log('disco');
  }) 
}); 