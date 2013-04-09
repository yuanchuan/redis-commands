
var expireTimers = module.exports = {};

var memo = {
  timeout: Object.create(null),
  timers: Object.create(null),
  stamps: Object.create(null)
}


expireTimers.set = function(key, timeout, action) {
  memo.timeout[key] = timeout;
  memo.stamps[key] = Date.now();
  memo.timers[key] = setTimeout(function() {
    action();
    expireTimers.del(key);
  }, timeout);
}


expireTimers.get = function(key) {
  return memo.timeout[key] - (Date.now() - memo.stamps[key]);
}


expireTimers.del = function(key) {
  clearTimeout(memo.timers[key]); 
  delete memo.timeout[key];
  delete memo.timers[key];
  delete memo.stamps[key];
}


expireTimers.exists = function(key) {
  return {}.hasOwnProperty.call(memo.timers, key);
};
