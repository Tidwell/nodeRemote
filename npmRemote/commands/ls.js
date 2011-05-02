module.exports = function(socket) {
  var npm = require("npm")
  npm.load({}, function (er) {
    if (er) return handlError(er)
    npm.commands.ls([], function (er, data) {
      if (er) {
        throw new Error('ls error');
      }
    })
    var alldata = []
    npm.on("log", function (data) {
      if (data.msg.name && data.level == -1) {
        alldata.push(data);
        socket.broadcast({command: 'ls', data: data});
      }
    })
  })
}