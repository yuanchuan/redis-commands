
var types = module.exports = function() {
  this.memo = Object.create(null);
}

types.prototype.exists = function(key) {
  return {}.hasOwnProperty.call(this.memo, key);
}  

types.prototype.get = function(key) {
  return this.memo[key];
}
 
types.prototype.set = function(key, name) {
  this.memo[key] = name;
}

types.prototype.keys = function() {
  return Object.keys(this.memo);
}

types.prototype.del = function(key) {
  delete this.memo[key];
}

types.prototype.delAll = function() {
  this.keys().forEach((this.del).bind(this)); 
}
 
 

