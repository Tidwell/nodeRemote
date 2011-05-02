module.exports = (function() {
  //the object we make public, each property corresponds to a command from the client
  return {
    ls: require('./commands/ls'),
    info: require('./commands/info'),
    registry: require('./commands/registry'),
    install: require('./commands/install'),
    uninstall: require('./commands/uninstall'),
    version: require('./commands/version')
  }
}());