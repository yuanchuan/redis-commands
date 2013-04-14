
var store = module.exports = function store() {
  this.memo = Object.create(null);
}

store.prototype.exists = function(key) {
  return {}.hasOwnProperty.call(this.memo, key);
}  

store.prototype.get = function(key) {
  return this.memo[key];
}
 
store.prototype.set = function(key, name) {
  this.memo[key] = name;
}

store.prototype.del = function(key) {
  delete this.memo[key];
}

store.prototype.keys = function() {
  return Object.keys(this.memo);
}

store.prototype.delAll = function() {
  this.memo = Object.create(null);
}

store.prototype.hexists = function(hash, field) {
  if (!this.exists(hash)) return false; 
  if (this.memo[hash] === undefined) return false;      
  return {}.hasOwnProperty.call(this.memo[hash], field);
}

store.prototype.hset = function(hash, field, value) {
  var retval = 0;
  if (!this.hexists(hash, field)) {
    this.memo[hash] = Object.create(null);
    retval = 1;
  }
  this.memo[hash][field] = value;
  return retval;
}

store.prototype.hget = function(hash, field) {
  return this.memo[hash][field];
}

store.prototype.hdel = function(hash, field) {
  if (!this.memo[hash] === undefined) {
    delete this.memo[hash][field];
  }
}
