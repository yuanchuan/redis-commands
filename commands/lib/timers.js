
var expireTimers = module.exports = {};
var memo = {};


expireTimers.exists = function(key) {
  return {}.hasOwnProperty.call(memo, key);
};  


expireTimers.set = function(key, timeout, action) {
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
  if (expireTimers.exists(key)) {
    clearTimeout(memo[key].timer);
  }
  delete memo[key];
}

