module.exports = function(socket,args) {
  var npm = require("npm")
  npm.load({}, function (er) {
    if (er) return handlError(er)
    npm.commands.uninstall([args], function (er, data) {
      if (er) {
        throw new Error('ls error');
      }
    })
    var broadsent = false;
    npm.on("log", function (data) {
      if (!broadsent) {
        socket.broadcast({command: 'uninstall', data: {stdout: data, json: {data: data, name: args}}});
        broadsent = true;
        console.log(data);
      }
    })
  })
}