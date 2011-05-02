var installedList = {};

function npmRemote(){
  var socket;
  var remote = this;
  var registry;
  
  this.connect = function() {
    socket = new io.Socket();
    socket.connect();
    socket.on('connect', function(){
      stdout('','Connected to Server');
      remote.init();
    });
    socket.on('message', function(args){
      remote.renderer[args.command](args);
    });
    socket.on('disconnect', function(){
      stdout('','Disconnected from Server');
    });
  };
  
  this.init = function() {
    remote.bind();
    socket.send({command: 'ls'});
  };
  
  var infoRend = new infoRenderer();
  this.renderer = {
    ls : function(args) {
      installedList = {};
      var pList = $('.packageList ul');
      pList.html('');
      stdout(args.data.stdout, 'installed active packages');
      pList.html();
      args.data.json.forEach(function(pack) { 
        if (pack.name) {
          pList.append('<li>'+pack.name+'</li>');
          installedList[pack.name] = pack;
        }
      });
    },
    info: function(args) {
      stdout(args.data.stdout, 'info '+args.data.json.name);
      infoRend.render(args.data.json);
    },
    registry: function(args) {
      registry = args.data.json;
      $('.registry ul').hide();
      stdout('result loaded from server', 'registry');
      var data = args.data.json;
      for (property in data) {
        if (data[property].name) {
          var addedClass = '';
          if (typeof(installedList[data[property].name]) != 'undefined') {
            addedClass = 'installed';
          }
          $('.registry ul').append('<li class="'+addedClass+'">'+data[property].name+'</li>');
        }
      }
      $('.registry p').hide();
      $('.registry ul').show();
    },
    install: function(args) {
      stdout(args.data.stdout,'install');
      alert(args.data.json.name+' was successfully installed');
      socket.send({command: 'ls'});
    },
    uninstall: function(args) {
      stdout(args.data.stdout,'uninstall');
      alert(args.data.json.name+' was successfully uninstalled');
      socket.send({command: 'ls'});
    },
    error : function(args) {
      stdout(args.data.stdout,'error');
      alert(args.data.json.error);
    }
  };
  
  function stdout(data, cmd) {
    $('.stdout pre').append('<strong>'+(cmd || '')+'</strong>');
    $('.stdout pre').append('<div>'+data+'</div>');
    var div = document.getElementsByClassName('stdout')[0];
    div.scrollTop = div.scrollHeight;
  }
  
  this.bind = function() {
    var pList = $('.packageList ul');
    pList.live('click', function(event) {
      if (event.target.nodeName.toLowerCase() == 'li') {
        $(event.target).effect("highlight", {}, 3000);
        socket.send({command: 'info', args: $(event.target).html()});
      }
    });
    
    var reg = $('.registry ul');
    reg.live('click', function(event) {
      if (event.target.nodeName.toLowerCase() == 'li') {
        $(event.target).effect("highlight", {}, 3000);
        socket.send({command: 'info', args: $(event.target).html()});
      }
    });
    
    $('.install').live('click', function(event) {
      var toInstall = $(this).attr('rel');
      if (confirm('Do you want to install '+toInstall+'?')) {
        socket.send({command: 'install', args: toInstall});
      }
    });
    $('.uninstall').live('click', function(event) {
      var toUninstall = $(this).attr('rel');
      if (confirm('Do you want to uninstall '+toUninstall+'?')) {
        socket.send({command: 'uninstall', args: toUninstall});
      }
    });
    $('.registry p').hide();
    $('.registry .reload').live('click', function(event) {
      $('.registry .reload').hide();
      socket.send({command: 'registry'});
      $('.registry p').show();
    });
  };
}