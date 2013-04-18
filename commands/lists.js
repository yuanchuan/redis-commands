
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.lpush = function(key, val/*, val1, val2... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_list'
  );
  this.__keys.set(key, 'list');

  //A little optimize.
  if (arguments.length < 3) {
    this.__store.list.lpush(key, val);
  } else {
    [].slice.call(arguments, 1).forEach((function(val) {
      this.__store.list.lpush(key, val);
    }).bind(this)); 
  }
  return this.__store.list.len(key);
}

R.lpushx = function(key, val) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_list'
  ); 
  if (!this.exists(key)) return 0;
  this.lpush(key, val);
  return this.__store.list.len(key);
}

R.rpush = function(key, val/*, val1, val2... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_list'
  );
  this.__keys.set(key, 'list');
  if (arguments.length < 3) {
    this.__store.list.rpush(key, val);
  } else {
    [].slice.call(arguments, 1).forEach((function(val) {
      this.__store.list.rpush(key, val);
    }).bind(this));
  }
  return this.__store.list.len(key); 
}

R.rpushx = function(key, val) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_list'
  ); 
  if (!this.exists(key)) return 0;
  this.rpush(key, val);
  return this.__store.list.len(key);
}

R.lpop = function(key) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_list'
  );
  return this.__store.list.lpop(key);
}
 
R.rpop = function(key) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_list'
  );
  return this.__store.list.rpop(key);
}
 
R.llen = function(key) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_list'
  );
  if (!this.exists(key)) return 0;
  return this.__store.list.len(key);
}

R.lrange = function(key, start, end) {
  this.__check(arguments).whether(
    'missing_1st_to_3rd', 'key_type_not_list'
  );
  if (!this.exists(key)) return [];
  var len = this.llen(key);
  return this.__store.list.range(key, 
    normalizeOffset(start, len),
    normalizeOffset(end, len)
  );
}

R.lindex = function(key, index) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_list'
  );
  index = normalizeOffset(index, this.llen(key)); 
  return this.__store.list.get(key, index); 
}

R.linsert = function(key, side, pivot, val) {

}

R.ltrim = function(key, start, end) {
  
}

R.lset = function(key, index, val) {
      
}

R.lrem = function() {

}

function normalizeOffset(offset, length) {
  if (offset < 0) {
    offset = ((offset < -length) ? -length : offset) + length;
  }
  return offset;
}

R.blpop =
R.brpop =
R.rpoplpush = function() {
  throw Error("Function not implemented");
}

