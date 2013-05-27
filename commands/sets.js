
var Redis = module.exports = require('./redis');
var R = Redis.prototype;

R.sismember = function(skey, member) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_set'
  );
  return this.__store.set.ismember(skey, member) ? 1 : 0;
}
 
R.sadd = function(skey/*member1, member2...*/) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_set'
  );
  var count = 0;
  this.__keys.set(skey, 'set');
  [].slice.call(arguments, 1).forEach((function(member) {
    if (this.sismember(skey, member)) return;
    this.__store.set.add(skey, member);
    count += 1;
  }).bind(this));
  return count;
}

R.srem = function(skey/*, member1, member2...*/) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'key_type_not_set'
  ); 
  var count = 0;
  [].slice.call(arguments, 1).forEach((function(member) {
    if (this.sismember(skey, member)) {
      this.__store.set.del(skey, member);
      count += 1;
    }
  }).bind(this));     
  return count;
}

R.smembers = function(skey) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_set'
  ); 
  return this.__store.set.members(skey);
}

R.scard = function(skey) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_set'
  ); 
  return this.__store.set.card(skey);
}

R.srandmember = function(skey, count) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_set'
  ); 
  if (undefined === count) count = 1; 
  else this.__check(arguments).whether('2nd_not_integer'); 
  var members = this.smembers(skey);
  if (!members.length) return null;
  if (count >= 0) {
    if (count >= members.length) {
      return sample_shuffle(members);
    }
    return sample_floyd(count, members);
  } else {
    return sample_normal(Math.abs(count), members);
  }
}

R.spop = function(skey) {
  this.__check(arguments).whether(
    'missing_1st', 'key_type_not_set'
  );  
  var member = this.srandmember(skey, 1);
  this.srem(skey, member);
  return member;
}
 
R.smove = function(skey1, skey2, member){
  this.__check(arguments).whether(
    'missing_1st_to_3rd', '1st_or_2nd_key_type_not_set'
  );
  if (!this.sismember(skey1, member)) return 0;
  if (!this.sismember(skey2, member)) {
    this.sadd(skey2, member);  
    // srem after sadd
    this.srem(skey1, member);
    return 1;
  } else {
    this.srem(skey1, member);
    return 0;
  }
}

R.sdiff = function(/* key1, key2... */) {
  this.__check(arguments).whether(
    'missing_1st', 'any_key_type_not_set'
  );
  if (arguments.length == 1) { 
    return this.smembers(arguments[0]);
  }
  return this.__store.set.diff.apply(
    this.__store.set, arguments
  );
}

R.sdiffstore = function(skey/* key1, key2... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'any_key_type_not_set'
  );
  var diff = this.sdiff.apply(this, 
    [].slice.call(arguments, 1)
  );             
  return diff.length
    ? this.sadd.apply(this, [skey].concat(diff)) 
    : 0;   
}

R.sinter = function(/* key1, key2... */) {
  this.__check(arguments).whether(
    'missing_1st', 'any_key_type_not_set'
  );
  if (arguments.length == 1) { 
    return this.smembers(arguments[0]);
  } 
  return this.__store.set.inter.apply(
    this.__store.set, arguments
  ); 
}

R.sinterstore = function(skey/* key1, key2... */) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'any_key_type_not_set'
  );
  var inter = this.sinter.apply(this, 
    [].slice.call(arguments, 1)
  );             
  return inter.length
    ? this.sadd.apply(this, [skey].concat(inter)) 
    : 0;    
}

R.sunion = function(/* key1, key2... */) {
  this.__check(arguments).whether(
    'missing_1st', 'any_key_type_not_set'
  );  
  if (arguments.length == 1) { 
    return this.smembers(arguments[0]);
  } 
  return this.__store.set.union.apply(
    this.__store.set, arguments
  );
}

R.sunionstore = function(skey/*, key1, key2..*/) {
  this.__check(arguments).whether(
    'missing_1st_or_2nd', 'any_key_type_not_set'
  );
  var union = this.sunion.apply(this, 
    [].slice.call(arguments, 1)
  );             
  return union.length
    ? this.sadd.apply(this, [skey].concat(union)) 
    : 0;
}


// normal random list
function sample_normal(m, list) {
  var s = [];
  var n = list.length;
  while (s.length < m) {
    s.push(list[Math.floor(Math.random() * n)]);
  }
  return s;
}

// The Microsoft shuffle
// http://www.robweir.com/blog/2010/02/microsoft-random-browser-ballot.html
function sample_shuffle(list) {
  return list.sort(function() {
    return 0.5 * Math.random();
  });
}

// Floyd algorithm
// From the book "More Programming Pearls"
function sample_floyd(m, list) {
  var s = []; 
  var n = list.length - 1;
  for (var idx = n - m + 1; idx <= n; ++idx) {
    var candi = list[Math.floor(Math.random() * idx)];
    s.push(!~s.indexOf(candi) ? candi : list[idx]);
  }
  return s;
}

