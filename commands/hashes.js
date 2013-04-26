
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.hexists = function(hkey, field) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_hash' 
  );
  if (this.__store.hash.exists(hkey, field)) return 1;
  return 0;
}

R.hset = function(hkey, field, val) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash'
  );
  var retval = this.hexists(hkey, field) ? 0 : 1;
  this.__timers.del(hkey);
  this.__keys.set(hkey, 'hash');
  this.__store.hash.set(hkey, field, val);
  return retval;
}

R.hsetnx = function(hkey, field, value) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash'
  ); 
  if (!this.hexists(hkey, field)) {
    return this.hset(hkey, field, value);
  }
  return 0;
}

R.hget = function(hkey, field) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_hash'
  );
  if (!this.hexists(hkey, field)) {
    return null;
  }
  return this.__store.hash.get(hkey, field);
}

R.hdel = function(hkey/*, field1, field2... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_hash'
  ); 
  var count = 0;
  [].slice.call(arguments, 1).forEach((function(field) {
    if (this.hexists(hkey, field)) {
      this.__store.hash.del(hkey, field);
      count += 1;
    }
  }).bind(this));
  return count;
}

R.hkeys = function(hkey) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  ); 
  return this.exists(hkey) 
    ? this.__store.hash.fields(hkey)
    : [];
}

R.hvals = function(hkey) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  ); 
  return this.exists(hkey) 
    ? this.hkeys(hkey).map((function(field) {
        return this.hget(hkey, field);
      }).bind(this))
    : [];
}
R.hgetall = function(hkey) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  );
  var retarr = [];
  if (this.exists(hkey)) {
    this.hkeys(hkey).forEach((function(field) {
      retarr.push(field, this.hget(hkey, field));
    }).bind(this));
  }
  return retarr;
}

R.hlen = function(hkey) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_hash'
  ); 
  return this.hkeys(hkey).length;
}

R.hmset = function(hkey, field, val/*, field2, val2...*/) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'even_args'
  );
  for (var i = 1; i < arguments.length; i += 2) {
    this.hset(hkey, arguments[i], arguments[i + 1]);
  }
}

R.hmget = function(hkey /*, field, field2,... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd'
  ); 
  return [].slice.call(arguments, 1).map((function(field) {
    return this.hget(hkey, field);    
  }).bind(this));
}

R.hincrby = function(hkey, field, amount) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash',
    'field_val_not_integer', '3rd_not_integer'
  ); 
  if (!this.hexists(hkey, field)) {
    this.hset(hkey, field, 0);
  }
  this.hset(hkey, field, parseInt(this.hget(hkey, field), 10) + amount);
  return this.hget(hkey, field);
}

R.hincrbyfloat = function(hkey, field, amount) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_hash', 
    'field_val_not_number', '3rd_not_number'
  ); 
  if (!this.hexists(hkey, field)) {
    this.hset(hkey, field, 0);
  }
  this.hset(hkey, field, (+this.hget(hkey, field) + (+amount)));
  return this.hget(hkey, field);      
}
 
