var childExec = require(process.cwd()+'/npmRemote/childHelper');

module.exports = function(socket, args) {
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
}