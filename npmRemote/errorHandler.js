module.exports = {
  handle: function(args,error) {
    var msg = 'Unknown error.  See stdout for full error message';
    
    if (error.message.indexOf('depended upon by') != -1) {
      msg = 'Dependancy Error. Uninstall other packages that depend upon this package then try again.'
    }
    else if (error.message.indexOf('Not supported on node@') != -1) {
      msg = 'This package is not supported on your current version of node.js'
    }
    else if (error.message.indexOf('info using') != -1) {
      var parser = require('./parser');
      msg = undefined; //hack to not send an error if version throws an error
      var jdata = parser.version(error.message);
      args.socket.broadcast({command: 'version', data: {stdout: error.message, json: jdata}});
    }
        
    if (msg) {
      console.log('exec error(could be fatal): '+error);
      args.socket.broadcast({
        command: 'error', 
        data: {
          json: {
            error: msg
          }, 
          stdout: error.message
        }
      });
    }
  }
}
