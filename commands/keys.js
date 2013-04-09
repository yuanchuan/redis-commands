
var minimatch = require('minimatch');


/**
 *  Expose.
 */
var Redis = module.exports = require('./lib/Redis');


/**
 * Alias for Redis.prototype.
 */
var R = Redis.prototype;


R.exists = function(key) {
  return {}.hasOwnProperty.call(this.__store, key) ? 1 : 0;
}                


R.del = function(/* key1, key2... */) {
  var count = 0;
  [].forEach.call(arguments, (function(key) {
    if (this.exists(key)) {
      delete this.store[key];
      count += 1;
    }
  }).bind(this));
  return count;
}                


R.keys = function(pattern) {
  return Object.keys(this.__store).filter(function(key) {
    return minimatch(key, pattern);
  });
}


R.expire = function(key, time) {

}

R.expireat = function() {

}


R.ttl = function(key, time) {

}

R.persist = function(key, time) {

}

R.pexpire = function(key, time) {

}

R.pttl = function(key, time) {

}
 
R.pexpireat = function(key, time) {

}

R.randomkey = function(key, time) {

}

R.rename = function(key, time) {

}

R.renamenx = function(key, time) {

}

R.type = function(key, time) {

}


/**
 * Misc function which is too hard to implement. 
 * Or might be implemented in the future.
 */

R.dump = function() {}
R.restore = function() {}
R.sort = function() {}
R.move = function() {}
R.migrate = function() {}
R.object = function() {}

