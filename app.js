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
    if (args.command == 'ls') {
      remote.ls(socket)
    }
    if (args.command == 'info') {
      remote.info(socket, args.args)
    }
    if (args.command == 'registry') {
      remote.registry(socket, args);
    }
  }) 
  client.on('disconnect', function(){
    console.log('disco');
  }) 
}); 