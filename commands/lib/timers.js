
var expireTimers = module.exports = {};
var memo = {};


expireTimers.exists = function(key) {
  return {}.hasOwnProperty.call(memo, key);
};  


expireTimers.clear = function(key) {
  if (expireTimers.exists(key)) {
    clearTimeout(memo[key].timer);
  } 
};  

   
expireTimers.set = function(key, timeout, action) {
  expireTimers.clear();
  memo[key] = {
    timeout: timeout,
    stamp: Date.now(),
    timer: setTimeout(function() {
      action();
      expireTimers.del(key);
    }, timeout)        
  };
}


expireTimers.get = function(key) {
  if (expireTimers.exists(key)) {
    return memo[key].timeout - (Date.now() - memo[key].stamp);
  }
}


expireTimers.del = function(key) {
  expireTimers.clear();
  delete memo[key];
}

