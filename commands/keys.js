
var minimatch = require('minimatch')
  , timers = require('./lib/timers');


var Redis = module.exports = require('./lib/Redis');
var R = Redis.prototype;


R.exists = function(key) {
  return {}.hasOwnProperty.call(this.__store, key) ? 1 : 0;
}                


R.del = function(/* key1, key2... */) {
  var count = 0;
  [].forEach.call(arguments, (function(key) {
    if (this.exists(key)) {
      timers.del(key);
      delete this.__store[key];
      count += 1;
    }
  }).bind(this));
  return count;
}                


R.keys = function(pattern) {
  return Object.keys(this.__store).filter(function(key) {
    return minimatch(key, pattern || '');
  });
}

 
R.randomkey = function(key) {  
  var keys = Object.keys(this.__store);
  return keys[Math.floor(Math.random() * keys.length)];
}


R.pexpire = function(key, msec) {
  if (!this.exists(key)) return 0;
  if (msec < 0)  msec = 0;
  var self = this;
  timers.set(key, msec, function() {
    self.del(key);
  });
  return 1;    
}

 
R.expire = function(key, sec) {
  var msec = sec * 1e3;
  return this.pexpire(key, msec); 
}


R.pexpireat = function(key, umsec) {
  var msec = umsec - Date.now();
  return this.pexpire(key, msec);
}


R.expireat = function(key, usec) {
  var msec = (usec - Math.floor(Date.now() / 1e3)) * 1e3;
  return this.pexpire(key, msec);
}


R.pttl = function(key) {
  if (!this.exists(key)) return -2;
  if (!timers.exists(key)) return -1;
  return timers.get(key);     
}


R.ttl = function(key) {
  var msec = this.pttl(key);  
  var method = msec > 1000 ? 'floor' : 'ceil';
  return msec > 0 ? Math[method](msec / 1e3) : msec; 
}


R.persist = function(key) {
  if (!this.exists(key) || !timers.exists(key)) return 0;              
  timers.del(key);
  return 1;
}


R.rename = function(key1, key2) {
  if (!this.exists(key1)) {
    throw Error("No such key");
  }
  if (key1 === key2) {
    throw Error("Source and destination objects are the same")
  }
  this.del(key2);
  this.__store[key2] = this.__store[key1]; 
  if (timers.exists(key1)) {
    this.pexpire(key2, this.pttl(key1));
  }
  this.del(key1);
}


R.renamenx = function(key1, key2) {
  if (this.exists(key2)) return 0;
  return this.rename(key1, key2);
}


R.type = function(key) {
  return this.__type || 'none';
}


//These are really hard to implement :D

R.dump = 
R.restore = 
R.sort = 
R.move = 
R.migrate = 
R.object = function() {
  throw Error('Function not implemented');
}

