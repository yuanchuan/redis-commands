
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
  // The unshift will become quite inefficent as the array getting bigger.
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

lists.prototype.range = function(key, start, end) {
  if (this.exists(key)) {
    return this.memo[key].slice(start, end + 1);  
  }
}

lists.prototype.trim = function(key, start, end) {
  this.memo[key] = this.range(key, start, end);
}

lists.prototype.removeFirst = function(key, num, item) {
  var count = 0;
  if (this.exists(key)) {
    while(num--) {
      var idx = this.memo[key].indexOf(item);
      if (idx == -1) break;
      this.removeByIndex(key, idx);
      count += 1;
    }
  }
  return count;
}

lists.prototype.removeLast = function(key, num, item) {
  var count = 0;
  if (this.exists(key)) {
    while(num--) {
      var idx = this.memo[key].lastIndexOf(item);
      if (idx == -1) break;
      this.removeByIndex(key, idx);
      count += 1;
    }
  }
  return count;
}

lists.prototype.removeAll = function(key, item) {
  var count = 0;
  if (this.exists(key)) {
    while((idx = this.memo[key].indexOf(item)) !== -1) {
      this.removeByIndex(key, idx);
      count += 1;
    }
  }
  return count;       
}
 
lists.prototype.removeByIndex = function(key, index) {
  if (this.exists(key)) {
    return this.memo[key].splice(index, 1);
  }
}

lists.prototype.set = function(key, index, val) {
  if (this.exists(key)) {
    this.memo[key][index] = val;
  }
}

lists.prototype.del = function(key) {
  delete this.memo[key];
}

lists.prototype.delAll = function(key) {
  this.memo = Object.create(null);
}
