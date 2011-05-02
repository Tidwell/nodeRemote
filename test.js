var npm = require("npm")
npm.load({}, function (er) {
  if (er) return handlError(er)
  npm.commands.ls([], function (er, data) {
    if (er) console.log(er)
    // command succeeded, and data might have some info
    console.log(data);
  })
  npm.on("log", function (message) {  })
})

