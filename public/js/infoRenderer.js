function infoRenderer() {
  this.render = function(data) {
    var content = '<ul class="infoContainer">';
    function recurRender(obj) {
      for (property in obj) {
        if (typeof(obj[property]) == 'object' && !obj[property].forEach) {
          content += '<li><label>'+property+':</label><span><ul>'
          recurRender(obj[property]);
          content += '</ul></span></li>';
        }
        if (typeof(obj[property]) == 'string') {
          content += '<li><label>'+property+':</label><span>'+obj[property].replace('<','').replace('>', '')+'</span></li>';
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
    
    $.window({
       showModal: false,
       icon: "/images/icons/page_magnify.png",
       title: data.name+" - Info",
       frameClass: "packageInfo",
       content: content,
       width: 600,
       height: 300
    });
  };
}