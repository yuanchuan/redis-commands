
var keys = module.exports = function() {
  this.memo = Object.create(null);
}

keys.prototype.exists = function(key) {
  return {}.hasOwnProperty.call(this.memo, key);    
}

keys.prototype.all = function() {
  return Object.keys(this.memo);
}                                                                 

keys.prototype.set = function(key, type) {
  this.memo[key] = type;      
}

keys.prototype.get = function(key) {
  return this.memo[key];
}

keys.prototype.del = function(key) {
  delete this.memo[key];
}

keys.prototype.delAll = function(key) {
  this.memo = Object.create(null);
}

keys.prototype.rename = function(key1, key2) {
  if (this.exists(key1)) {
    this.del(key2);
    this.set(key2, this.get(key1));
    this.del(key1);
  }
}

