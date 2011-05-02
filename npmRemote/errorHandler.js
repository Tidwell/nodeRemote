module.exports = {
  handle: function(args,error) {
    console.log('exec error(could be fatal): '+error);
    var msg = 'Unknown error.  See stdout for full error message';
    
    if (error.message.indexOf('depended upon by') != -1) {
      msg = 'Dependancy Error. Uninstall other packages that depend upon this package then try again.'
    }
    if (error.message.indexOf('Not supported on node@') != -1) {
      msg = 'This package is not supported on your current version of node.js'
    }
    
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
