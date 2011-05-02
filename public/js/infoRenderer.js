var openWindows = {};
function infoRenderer() {
  this.render = function(data) {
    if ($(".packageInfo.pkg_"+data.name).length > 0 && openWindows[data.name]) { 
      openWindows[data.name].restore();
      return;
    }
    
    var content = makeToolbar(data);
    content += '<ul class="infoContainer">';
    function recurRender(obj) {
      for (property in obj) {
        if (typeof(obj[property]) == 'object' && !obj[property].forEach) {
          content += '<li><label>'+property+':</label><span><ul>'
          recurRender(obj[property]);
          content += '</ul></span></li>';
        }
        if (typeof(obj[property]) == 'string') {
          content += '<li><label>'+property+':</label><span>'+obj[property].replace('<','&#060;').replace('>', '&#062;')+'</span></li>';
        }
        if (typeof(obj[property]) == 'object' && obj[property].forEach) {
          content += '<li><label>'+property+':</label><span><ul>'
          obj[property].forEach(function(item) {
            recurRender(obj[property]);
          });
          content += '</ul></span></li>';
        }
      }
    }
    recurRender(data);
    content += '</ul>';
    
    //memory leak becaus we dont remove from this array when the windows close
    //todo: fix, obv.
    openWindows[data.name] = $.window({
       showModal: false,
       icon: "/images/icons/page_magnify.png",
       title: data.name+" - Info",
       frameClass: "packageInfo pkg_"+data.name,
       content: content,
       width: 600,
       height: 300
    });
    
    function makeToolbar(data) {
      if (typeof(installedList[data.name]) != 'undefined') {
        return '<ul class="toolbar"><li class="uninstall" rel="'+data.name+'">Uninstall</li></ul>'
      }
      else {
        return '<ul class="toolbar"><li class="install" rel="'+data.name+'">Install</li></ul>'
      }
    }
  };
}