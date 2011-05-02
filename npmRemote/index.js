var util = require('util');
var exec = require('child_process').exec;
var http = require('http');
var errorHandler = require('./errorHandler');

var registryCache = null;
module.exports = (function() {
  var parser = require('./parser');
  //creates a child process that makes a call to exec and returns
  //stdout from that process
  //{command, callback}
  var childExec = function(args) {
    child = exec(args.command, function(error, stdout, stderr){
      if(error !== null) {
        errorHandler.handle(args, error);
      }
      else {
        args.callback(stdout);
      }
    });
  }
 
  return {
    ls: function(socket) {
      childExec({
        command: 'npm ls installed | grep active',
        callback: function(data) {
          var data = parser.ls(data);
          socket.broadcast({command: 'ls', data: data});
        },
        socket: socket
      });
    },
    info: function(socket, args) {
      childExec({
        command: 'npm info '+args,
        callback: function(infodata) {
          socket.broadcast({command: 'info', data: {stdout: infodata, json: eval('('+infodata+')')}});
        },
        socket: socket
      });
    },
    registry: function(socket) {
      if (!registryCache) {
        var options = {
          host: 'registry.npmjs.org',
          port: 80,
          method: 'GET'
        };
        
        var data = '';
        var req = http.request(options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            data += chunk;
          });
          res.on('end', function() {
            registryCache = {json: eval('('+data+')'), stdout: data};
            send(registryCache)
          });
        });
        req.end();
      }
      else {
        send(registryCache);
      }
      
      function send(data) {
        socket.broadcast({command: 'registry', data: data});
      }
    },
    install: function(socket, args) {
      childExec({
        command: 'npm install '+args,
        callback: function(data) {
          data = data.replace(' ', '');
          if (data == '') {
            data = 'no error reported from npm process. Assumed Success (yea...)';
            socket.broadcast({command: 'install', data: {stdout: data, json: {success: true, name: args}}});
          }
        },
        socket: socket
      });
    },
    uninstall: function(socket, args) {
      childExec({
        command: 'npm uninstall '+args,
        callback: function(data) {
          data = data.replace(' ', '');
          if (data == '') {
            data = 'no error reported from npm process. Assumed Success (yea...)';
            socket.broadcast({command: 'uninstall', data: {stdout: data, json: {success: true, name: args}}});
          }
        },
        socket: socket
      });
    }
  }
}());



console.log('loaded npmRemote');