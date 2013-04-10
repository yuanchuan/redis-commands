
module.exports = new Types();


function Types() {
  this.memo = Object.create(null);
}


Types.prototype.exists = function(key) {
  return {}.hasOwnProperty.call(this.memo, key);
}  

 
Types.prototype.get = function(key) {
  return this.memo[key];
}
 
  
Types.prototype.set = function(key, name) {
  this.memo[key] = name;
}


Types.prototype.del = function(key) {
  delete this.memo[key];
}

Types.prototype.keys = function() {
  return Object.keys(this.memo);
}

