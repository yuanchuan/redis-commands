
var strings = module.exports = function() {
  this.memo = Object.create(null);
}
 
strings.prototype.get = function(key) {
  return this.memo[key];
}
 
strings.prototype.set = function(key, val) {
  this.memo[key] = val;
}

strings.prototype.del = function(key) {
  delete this.memo[key];
}

strings.prototype.rename = function(key1, key2) {
  if (this.exists(key1)) {
    this.del(key2);
    this.set(key2, this.get(key1));
    this.del(key1);
  }
}
