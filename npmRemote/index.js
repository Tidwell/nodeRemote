var util = require('util');
var exec = require('child_process').exec;
var http = require('http');

var registryCache = null;
module.exports = (function() {
  var parser = require('./parser');
  //creates a child process that makes a call to exec and returns
  //stdout from that process
  //{command, callback}
  var childExec = function(args) {
    child = exec(args.command, function(error, stdout, stderr){
      if(error !== null)
      {
        console.log('exec error (this is probably fatal): ' + error);
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
        }
      });
    },
    info: function(socket, args) {
      childExec({
        command: 'npm info '+args,
        callback: function(infodata) {
          socket.broadcast({command: 'info', data: {stdout: infodata, json: eval('('+infodata+')')}});
        }
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
    }
  }
}());



console.log('loaded npmRemote');