
var lists = module.exports = function() {
  this.memo = Object.create(null);
}

lists.prototype.exists= function(key) {
  return {}.hasOwnProperty.call(this.memo, key);
}

lists.prototype.lpush = function(key, val) {
  if (!this.exists(key)) {
    // should be replaced with a more proper data structure like `dequeue`.
    this.memo[key] = [];
  }
  this.memo[key].unshift(val);
}

lists.prototype.rpush = function(key, val) {
  if (!this.exists(key)) {
    this.memo[key] = [];
  } 
  this.memo[key].push(val);
}

lists.prototype.len = function(key) {
  if (!this.exists(key)) return 0;
  return this.memo[key].length;
}

lists.prototype.lpop = function(key) {
  if (this.exists(key)) {
    return this.memo[key].shift();
  }
}

lists.prototype.rpop = function(key) {
  if (this.exists(key)) {
    return this.memo[key].pop();
  }
}

lists.prototype.get = function(key, index) {
  if (this.exists(key)) {
    return this.memo[key][index];
  } 
}

lists.prototype.del = function(key) {
  delete this.memo[key];
}

lists.prototype.delAll = function(key) {
  this.memo = Object.create(null);
}
