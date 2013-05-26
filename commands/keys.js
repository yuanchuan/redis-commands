
var minimatch = require('minimatch')
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.exists = function(key) {
  this.__check(arguments).whether(
    'missing_1st'
  ); 
  return this.__keys.exists(key) ? 1 : 0;
}                

R.type = function(key) {
  this.__check(arguments).whether(
    'missing_1st'
  ); 
  if (this.exists(key)) {
    return this.__keys.get(key);
  }
  return "none";
}
 
R.del = function(/* key1, key2... */) {
  this.__check(arguments).whether(
    'missing_1st'
  ); 
  var count = 0;
  [].forEach.call(arguments, (function(key) {
    if (this.exists(key)) {
      this.__timers.del(key);
      this.__store[this.type(key)].del(key);
      this.__keys.del(key);
      count += 1;
    }
  }).bind(this));
  return count;
}                

R.keys = function(pattern) {
  this.__check(arguments).whether(
    'missing_1st'
  ); 
  return this.__keys.all().filter(function(key) {
    return minimatch(key, pattern || '');
  });
}
 
R.randomkey = function() {  
  var keys = this.__keys.all();
  return keys[Math.floor(Math.random() * keys.length)];
}

R.pexpire = function(key, msec) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', '2nd_not_integer'
  );
  if (!this.exists(key)) return 0;
  if (msec < 0)  msec = 0;
  this.__timers.set(key, msec, (function() {
    this.del(key);
  }).bind(this));
  return 1;    
}
 
R.expire = function(key, sec) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', '2nd_not_integer'
  );
  var msec = sec * 1e3;
  return this.pexpire(key, msec); 
} 
 
R.pexpireat = function(key, umsec) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', '2nd_not_integer'
  ); 
  var msec = umsec - Date.now();
  return this.pexpire(key, msec);
}

R.expireat = function(key, usec) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', '2nd_not_integer'
  ); 
  var msec = (usec - Math.floor(Date.now() / 1e3)) * 1e3;
  return this.pexpire(key, msec);
}

R.pttl = function(key) {
  this.__check(arguments).whether(
    'missing_1st'
  ); 
  if (!this.exists(key)) return -2;
  if (!this.__timers.exists(key)) return -1;
  return this.__timers.get(key);     
}

R.ttl = function(key) {
  this.__check(arguments).whether(
    'missing_1st'
  );  
  var msec = this.pttl(key);  
  var method = msec > 1000 ? 'floor' : 'ceil';
  return msec > 0 ? Math[method](msec / 1e3) : msec; 
}

R.persist = function(key) {
  this.__check(arguments).whether(
    'missing_1st'
  ); 
  if (!this.exists(key) || !this.__timers.exists(key)) return 0;              
  this.__timers.del(key);
  return 1;
}

R.rename = function(key1, key2) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', '1st_not_exist', '1st_and_2nd_equal'
  ); 
  this.__store[this.type(key1)].rename(key1, key2);
  if (this.__timers.exists(key1)) {
    this.pexpire(key2, this.pttl(key1));
  }
  this.__keys.rename(key1, key2);
}

R.renamenx = function(key1, key2) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', '1st_and_2nd_equal'
  ); 
  if (this.exists(key2)) return 0;
  this.rename(key1, key2);
  return 1;
}

R.dump = 
R.restore = 
R.sort = 
R.move = 
R.migrate = 
R.object = function() {
  throw Error('Function not implemented');
}

