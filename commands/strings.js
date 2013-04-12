
var Redis = module.exports = require('./lib/Redis');
var R = Redis.prototype;


R.set = function(key, value) {
  // require 2 args
  // require string type
  // value accept string or number type.
  this.__timers.del(key);
  this.__types.set(key, 'string');
  this.__store.set(key, value);
}

 
R.get = function(key) {
  // require 1 arg
  // require string type
  if (!this.__store.exists(key)) {
    return null;
  } 
  return this.__store.get(key);
}


R.getset = function(key, value) {
  // require 2 args
  // require string type
  var old = this.get(key);
  this.set(key, value);
  return old;
}


R.strlen = function(key) {
  // require 1 arg
  // require string sype
  if (this.__store.exists(key)) {
    return this.get(key).length;
  } else {
    return 0;
  }
}


R.incrby = function(key, amount) {
  // require 2 args
  // require string type
  // require key's value to be an Integer
  // require amount to be an Integer
  if (!this.__store.exists(key)) {
    this.set(key, "0");
  } 
  this.set(key, parseInt(this.get(key), 10) + amount);
  return this.get(key); 
}

 
R.incr = function(key) {
  // require 1 arg
  // require string type
  // require key's value to be an Integer
  return this.incrby(key, 1);
}


R.decrby = function(key, amount) {
  return this.incrby(key, -1 * amount);
}

 
R.decr = function(key) {
  return this.incrby(key, -1);
}

 
R.incrbyfloat = function(key, amount) {
  // require 2 args
  // require string type
  // require key's value to be a number
  // require amount to be a number     
  if (!this.__store.exists(key)) {
    this.set(key, "0");
  }
  this.set(key, (+this.get(key)) + (+amount));
  return this.get(key);
}


R.getrange = function(key, from, to) {
  // requrie 3 arg
  // require string type
  var string = this.get(key)
    , len = string.length;
  return string.substr(
    normalizeOffset(from, len), 
    normalizeOffset(to, len) + 1
  );
}


R.append = function(key, str) {
  // require 2 args
  // require string type
  if (!this.__store.exists(key)) {
    this.set(key, '');
  }
  this.set(key, this.get(key) + str);
  return this.get(key);
}


function normalizeOffset(offset, length) {
  // -7 -6 -5 -4 -3 -2 -1
  // 0  1  2  3  4  5  6
  // a  b  c  d  e  f  g
  if (offset < 0) {
    offset = ((offset < -length) ? -length : offset) + length;
  }
  return offset;
}


/*

if (this.__store.exists(key) && this.__types.get(key) !== 'string') {
  throw Error('Operation against a key holding the wrong kind of value');  
}

if (arguments.length < 2) {
  throw Error('Wrong number of arguments');
}

if (typeof value !== 'string') {
  throw Error('Invalid type of value');
}

*/
