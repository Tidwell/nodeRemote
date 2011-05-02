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
    socket.send({command: 'version'});
  };
  
  var infoRend = new infoRenderer();
  this.renderer = {
    ls : function(args) {
      var data = args.data;
      var pList = $('.packageList ul');
      //pList.html('');
      stdout(data.toString(), 'installed active packages');
      if (data.msg.name && data.level == -1 && $('.packageList ul li[rel="'+data.msg.name+'"]').length < 1) {
        pList.append('<li rel="'+data.msg.name+'">'+data.msg.name+'</li>');
        installedList[data.msg.name] = data.msg;
      }
    },
    info: function(args) {
      stdout(args.data.stdout, 'info '+args.data.json.name);
      infoRend.render(args.data.json);
    },
    registry: function(args) {
      registry = args.data.json;
      $('.registry ul').hide().children().remove();
      stdout(args.msg ? args.msg : 'result loaded from server', 'registry');
      var data = args.data.json;
      for (property in data) {
        if (data[property].name) {
          if (args.filter) {
            if (data[property].name.indexOf(args.filter) != -1) {
              $('.registry ul').append('<li>'+data[property].name+'</li>');
            }
          }
          else {
            $('.registry ul').append('<li>'+data[property].name+'</li>');
          }
        }
      }
      $('.registry p').hide();
      $('.registry ul').show();
      $('.registry .search').show();
    },
    install: function(args) {
      stdout(args.data.stdout,'install');
      alert(args.data.json.name+' was successfully installed');
      socket.send({command: 'ls'});
    },
    uninstall: function(args) {
      stdout(args.data.stdout,'uninstall');
      if (args.data.json.data.pref == 'unbuild') {
        alert(args.data.json.name+' was successfully uninstalled');
        $('.packageList ul li[rel="'+args.data.json.name+'"]').remove();
        delete installedList[args.data.json.name];
        socket.send({command: 'ls'});
      }
      else {
        alert(args.data.json.data.pref);
      }
    },
    error : function(args) {
      stdout(args.data.stdout,'error');
      alert(args.data.json.error);
    },
    version: function(args) {
      stdout(args.data.stdout,'version');
      $('.versions .npm select, .versions .node select').children().remove();
      $('.versions .npm select').append('<option>'+args.data.json.npm+'</option>');
      $('.versions .node select').append('<option>'+args.data.json.node+'</option>');
    }
  };
  
  function stdout(data, cmd) {
    $('.stdout pre').append('<strong>'+(cmd || '')+'</strong>');
    $('.stdout pre').append('<div>'+data+'</div>');
    var div = document.getElementsByClassName('stdout')[0];
    div.scrollTop = div.scrollHeight;
  }
  
  this.bind = function() {
    $('.registry p').hide();
    $('.registry button').show();
    $('.registry .search').hide();
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
    $('.registry .reload').live('click', function(event) {
      $('.registry .reload').hide();
      socket.send({command: 'registry'});
      $('.registry .loading').show();
    });
    $('.registry .search input').unbind().keyup(function(event) {
      setTimeout(function() {
        if ($('.registry .search input').val().length > 1) {
          remote.renderer.registry({data: {json: registry}, filter: $('.registry .search input').val()})
        }
        else {
          remote.renderer.registry({data: {json: registry}})
        }
      }, 1000);
    });
  };
}