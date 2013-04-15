
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.hexists = function(hash, field) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_hash' 
  );
  if (!this.exists(hash)) return 0;
  if (!this.__keys[hash].store === undefined) return 0;
  return {}.hasOwnProperty.call(
    this.__keys[hash].store, field
  ) ? 1 : 0;
}


R.hset = function(hash, field, value) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash'
  );
  var retval = 0;
  this.__timers.del(hash);
  if (!this.hexists(hash, field)) {
    this.__keys[hash] = {
      type: 'hash',
      store: Object.create(null)
    }
    retval = 1;
  } 
  this.__keys[hash].store[field] = value;
  return retval;
}


R.hsetnx = function(hash, field, value) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash'
  ); 
  if (!hexists(hash, field)) {
    return this.hset(hash, field, value);
  }
  return 0;
}


R.hget = function(hash, field) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_hash'
  );
  if (!this.hexists(hash, field)) {
    return null;
  }
  return this.__keys[hash].store[field];
}


R.hdel = function(hash/*, field1, field2... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_hash'
  ); 
  var count = 0;
  [].slice.call(arguments, 1).forEach((function(field) {
    if (this.hexists(hash, field)) {
      delete this.__keys[hash].field; 
      count += 1;
    }
  }).bind(this));
  return count;
}


R.hgetall = function(hash) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  );
  var ret = [];
  if (this.exists(hash)) {
    for (var field in this.__keys[hash].store) {
      ret.push(field, this.__keys[hash].store[field]);
    }
  }
  return ret;
}


R.hkeys = function(hash) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  ); 
  return this.exists(hash) 
    ? Object.keys(this.__keys[hash].store)
    : [];
}


R.hvals = function(hash) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  ); 
  return this.exists(hash) 
    ? Object.keys(this.__keys[hash]).map(function(field) {
        return this.__keys[hash].store[field];
      }) 
    : [];
}


R.hlen = function(hash) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  ); 
  return this.hkeys(hash).length;
}


R.hmset = function(hash, field, value/*, field2, value2...*/) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'even_args'
  );
  for (var i = 1; i < arguments.length; i += 2) {
    this.hset(hash, arguments[i] = arguments[i + 1]);
  }
}


R.hmget = function(hash /*, field, field2,... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd'
  ); 
  [].slice.call(arguments, 1).map((function(field) {
    return this.hget(hash, field);    
  }).bind(this));
}


R.hincryby = function(hash, field, amount) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash', '3rd_not_integer'
  ); 
  if (!this.hexists(hash, field)) {
    this.hset(hash, field, 0);
  }
  this.hset(hash, field, parseInt(this.hget(hash, field), 10) + amount);
  return this.hget(key, field);
}


R.hincrybyfloat = function(hash, field, val) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash', '3rd_not_number'
  ); 
  if (!this.hexists(hash, field)) {
    this.hset(hash, field, 0);
  }
  this.hset(hash, field, (+this.hget(hash, field) + (+amount)));
  return this.hget(key, field);      
}
 
