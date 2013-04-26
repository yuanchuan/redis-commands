
var minimatch = require('minimatch')
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.flushdb = function() {
  this.__timers.delAll();
  this.__keys.delAll();
  this.__store['string'].delAll();
  this.__store['hash'].delAll();
  this.__store['list'].delAll();
  this.__store['set'].delAll();
  /*
  this.__store['sorted-set'].delAll();
  */
}

