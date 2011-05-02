var http = require('http');

var registryCache = null;

module.exports = function(socket) {
  //we cache the registry so we dont spam the server
  if (!registryCache) {
    var options = {
      host: 'registry.npmjs.org',
      port: 80,
      method: 'GET'
    };
    var data = '';
    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function() {
        //the response is a json object, so we can just eval it and ship that to the client
        registryCache = {json: eval('('+data+')'), stdout: data};
        socket.broadcast({command: 'registry', data: registryCache});
      });
    });
    req.end();
  }
  else {
    socket.broadcast({command: 'registry', data: registryCache});
  }
}