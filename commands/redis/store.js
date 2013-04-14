
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

