
var exists = require('fs').existsSync;
var Redis = module.exports = require('./commands/lib/Redis');
var names = ['keys', 'strings', 'hashes', 'lists', 'sets', 'sorted-sets']; 

names
  .map(function(name) {
    return './commands/' + name + '.js';
  })
  .filter(exists)
  .forEach(function(path) {
    var mod = require(path);
    for (var m in mod.prototype) {
      Redis.prototype[m] 
        = Redis.prototype[m.toUpperCase()] 
        = mod.prototype[m];
    }
  });

