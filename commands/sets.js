
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
 
R.smove = function(){

}

R.sdiff = function() {

}

R.sdiffstore = function() {

}

R.sinter = function() {

}

R.sinterstore = function() {

}

R.sunion = function() {

}

R.sunionstore = function() {

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

