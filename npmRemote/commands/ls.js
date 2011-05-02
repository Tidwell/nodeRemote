var childExec = require(process.cwd()+'/npmRemote/childHelper');
var parser = require(process.cwd()+'/npmRemote/parser');

module.exports = function(socket) {
  childExec({
    command: 'npm ls installed | grep active',
    callback: function(data) {
      var data = parser.ls(data);
      socket.broadcast({command: 'ls', data: data});
    },
    socket: socket
  });
}