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

R.srem = function() {

}

R.smembers = function() {

}
 
R.spop = function() {

}

R.srandmember = function() {

}
 
R.scard = function() {

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
