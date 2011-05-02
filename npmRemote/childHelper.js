var exec = require('child_process').exec;
var errorHandler = require('./errorHandler');

//creates a child process that makes a call to exec and returns
//stdout from that process also routes to our error handle if something goes bad
//{command, callback}
module.exports = function(args) {
    child = exec(args.command, function(error, stdout, stderr){
      if(error !== null) {
        errorHandler.handle(args, error);
      }
      else {
        args.callback(stdout);
      }
    });
  }
