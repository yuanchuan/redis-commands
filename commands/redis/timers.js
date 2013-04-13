
var timers = module.exports = function() {
  this.memo = Object.create(null);
}

timers.prototype.exists = function(key) {
  return {}.hasOwnProperty.call(this.memo, key);
}  

timers.prototype.get = function(key) {
  if (this.exists(key)) {
    return this.memo[key].timeout - (Date.now() - this.memo[key].stamp);
  }
}

timers.prototype.set = function(key, timeout, action) {
  this.clear();
  this.memo[key] = {
    timeout: timeout,
    stamp: Date.now(),
    timer: setTimeout((function() {
      action();
      this.del(key);
    }).bind(this), timeout)        
  };
}

timers.prototype.clear = function(key) {
  if (this.exists(key)) {
    clearTimeout(this.memo[key].timer);
  } 
};  

timers.prototype.del = function(key) {
  this.clear(key);
  delete this.memo[key];
}

timers.prototype.delAll = function() {
  Object.keys(this.memo).forEach((this.del).bind(this)); 
}
 

