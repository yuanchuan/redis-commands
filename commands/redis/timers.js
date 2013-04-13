
module.exports = new Timers();


function Timers() {
  this.memo = Object.create(null);
}


Timers.prototype.exists = function(key) {
  return {}.hasOwnProperty.call(this.memo, key);
}  


Timers.prototype.get = function(key) {
  if (this.exists(key)) {
    return this.memo[key].timeout - (Date.now() - this.memo[key].stamp);
  }
}

   
Timers.prototype.set = function(key, timeout, action) {
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


Timers.prototype.clear = function(key) {
  if (this.exists(key)) {
    clearTimeout(this.memo[key].timer);
  } 
};  

 
Timers.prototype.del = function(key) {
  this.clear();
  delete this.memo[key];
}

