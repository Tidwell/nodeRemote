var parser = require(process.cwd()+'/npmRemote/parser');
var childExec = require(process.cwd()+'/npmRemote/childHelper');
  
module.exports = function(socket, args) {
  childExec({
    command: 'npm -v',
    callback: function(data) {
      console.log(data)
      var jdata = parser.version(data);
      socket.broadcast({command: 'version', data: {stdout: data, json: jdata}});
    },
    socket: socket
  });
}