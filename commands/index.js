
var fs = require('fs');
var path = require('path');
var Redis = module.exports = require('./redis');

fs.readdirSync(__dirname)
  .map(function(name) {
    return path.join(__dirname, name);
  })
  .filter(function(path) { 
    return /[^(index)]\.js$/.test(path);
  })
  .forEach(function(path) {
    var mod = require(path);
    for (var m in mod.prototype) {
      Redis.prototype[m] = mod.prototype[m];
    }
  }); 

