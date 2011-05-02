module.exports = {
  ls: function(data) {
    var rowParsed = parseRowsProperties(data);
    var objectified = objectifyArray([
      function(column) { 
        var tmp = column.split('@');
        return {
          'name': tmp[0],
          'version': tmp[1]
        }
      }, 
      'status', 
      'description', 
      function(column) {
        var parsed = column.split(' ');
        return {
          keywords: parsed
        }
      }
    ], rowParsed);
    return {stdout: data, json: objectified};
  },
  version: function(data) {
    return {
      node: '',
      npm: trim(data)
    }
  }
}

var objectifyArray = function(names, array) {
  var dataSet = [];
  var rowCount = 0;
  array.forEach(function(row) {
    var i = 0;
    var rowData = {};
    row.forEach(function(column) {
      if (typeof(names[i]) === 'function') {
        var res = names[i](column);
        for (property in res) {
          rowData[property] = res[property];
        }
      }
      else {
        rowData[names[i]] = column; 
      }
      i++;
    });
    dataSet[rowCount] = rowData;
    rowCount++;
  });
  return dataSet;
}

 
var parseRowsProperties = function(data){
  var tmp = data;
  //split it by line, we assume each line represents a row of info
  tmp = tmp.split('\n');
  //to hold the returned object
  var dataSet = [];
  //a row counter as we don't want to name the properties of the object
  var i = 0;
  tmp.forEach(function(row) {
    var returnRow = [];
    //we assume anything more than one space is a break
    row = row.split('  ');
    row.forEach(function(item) {
      //strip surrounding whitesace
      item = trim(item);
      //if there is actually some text in the item
      if (item.length !== 0) {
        returnRow[returnRow.length] = item;
      }
      else {
        //empty, ignore it
      }
    });
    dataSet[i] = returnRow;
    i++;
  });
  return dataSet;
}

var trim = function(str) {
	return str.replace(/^\s+|\s+$/g,"");
}