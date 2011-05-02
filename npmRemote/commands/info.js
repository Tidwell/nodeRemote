var childExec = require(process.cwd()+'/npmRemote/childHelper');

module.exports = function(socket, args) {
  childExec({
    command: 'npm info '+args,
    callback: function(infodata) {
      socket.broadcast({command: 'info', data: {stdout: infodata, json: eval('('+infodata+')')}});
    },
    socket: socket
  });
}