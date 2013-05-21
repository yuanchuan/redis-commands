
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.set = function(key, val) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd'
  );
  this.__keys.set(key, 'string'); 
  this.__store.string.set(key, val);
  this.__timers.del(key);
}

R.setnx = function(key, val) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd'
  ); 
  if (this.exists(key)) {
    return 0;
  }
  this.set(key, val);
  return 1;
}

R.setex = function(key, sec, val) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd'
  );
  this.set(key, val);
  this.expire(key, sec);
}

R.psetex = function(key, msec, val) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd'
  );
  this.set(key, val);
  this.pexpire(key, msec);
}
 
R.get = function(key) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_string'
  );
  if (!this.exists(key)) {
    return null;
  } 
  return this.__store.string.get(key);
}

R.getset = function(key, val) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_string'
  ); 
  var old = this.get(key);
  this.set(key, val);
  return old;
}

R.mget = function(/* key1, key2... */) {
  this.__check(arguments).whether(
    'missing_1st'
  );  
  return [].map.call(arguments, (function(key) {
    return this.get(key);
  }).bind(this));
}

R.mset = function(key, val/* , key, val... */) {
  this.__check(arguments).whether(
    'odd_args'
  ); 
  for (var i = 0; i < arguments.length; i += 2 ) {
    this.set(arguments[i], arguments[i + 1]);
  }
}

R.msetnx = function(key, val/* , key, val... */) {
  this.__check(arguments).whether(
    'odd_args'
  ); 
  for (var i = 0, status = 1; i < arguments.length; i +=2 ) {
    if ( !status ) return 0;
    status = this.setnx(arguments[i], arguments[i + 1]);
  }
  return 1;
}

R.strlen = function(key) {
  this.__check(arguments).whether(
    'key_type_not_string'
  ); 
  if (this.exists(key)) {
    return this.get(key).length;
  } else {
    return 0;
  }
}

R.incrby = function(key, amount) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_string',
    'key_val_not_integer', '2nd_not_integer'
  ); 
  if (!this.exists(key)) {
    this.set(key, "0");
  } 
  this.set(key, parseInt(this.get(key), 10) + amount);
  return this.get(key); 
}
 
R.incr = function(key) {
  return this.incrby(key, 1);
}

R.decrby = function(key, amount) {
  return this.incrby(key, -1 * amount);
}
 
R.decr = function(key) {
  return this.incrby(key, -1);
}
 
R.incrbyfloat = function(key, amount) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_string',
    'key_val_not_number', '2nd_not_number'
  ); 
  if (!this.exists(key)) {
    this.set(key, "0");
  }
  this.set(key, (+this.get(key)) + (+amount));
  return this.get(key);
}

R.getrange = function(key, from, to) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_string'
  ); 
  var string = this.get(key)
  var len = string.length;
  return string.substr(
    normalizeOffset(from, len), 
    normalizeOffset(to, len) + 1
  );
}

R.setrange = function(key, offset, replacer) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_string', 
    '2nd_not_integer', '2nd_negative'
  );
  var origin = this.get(key);
  var len = origin.length - 1;
  var gap = len < offset ? new Array(offset - len).join('\x00') : '';
  var rest = origin.substr(offset + replacer.length);
  var result = origin.substr(0, offset).concat(gap, replacer, rest);
  this.__store.string.set(key, result);
  return result.length;
}

R.append = function(key, str) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_string'
  );
  if (!this.exists(key)) {
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

R.setbit =
R.getbit =
R.bittop =
R.bitcount = function() {
  throw Error('Function not implemented');
}

