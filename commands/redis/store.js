
var Store = module.exports = function Store() {
  this.memo = Object.create(null);
}

Store.prototype.exists = function(key) {
  return {}.hasOwnProperty.call(this.memo, key);
}  

Store.prototype.get = function(key) {
  return this.memo[key];
}
 
Store.prototype.set = function(key, name) {
  this.memo[key] = name;
}

Store.prototype.del = function(key) {
  delete this.memo[key];
}

Store.prototype.keys = function() {
  return Object.keys(this.memo);
}

Store.prototype.delAll = function() {
  this.memo = Object.create(null);
}

