
var exists = require('fs').existsSync;
var Redis = module.exports = require('./commands/redis');
var names = ['keys', 'strings', 'hashes', 'lists', 'sets', 'sorted-sets']; 

names
  .map(function(name) {
    return './commands/' + name + '.js';
  })
  .filter(exists)
  .forEach(function(path) {
    var mod = require(path);
    for (var m in mod.prototype) {
      Redis.prototype[m] = mod.prototype[m];
    }
  });

