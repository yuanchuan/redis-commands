
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
    for (var method in mod.prototype) {
      Redis.prototype[method] = mod.prototype[method];
    }
  });

