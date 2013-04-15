
var minimatch = require('minimatch')
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.flushdb = function() {
  this.__timers.delAll();
  this.__keys.delAll();
try {
  this.__store['strings'].delAll();
  this.__store['hashes'].delAll();
  this.__store['lists'].delAll();
  this.__store['sets'].delAll();
  this.__store['sorted-sets'].delAll();
} catch(e) {}
}

