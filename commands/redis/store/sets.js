
var sets = module.exports = function() {
  this.memo = Object.create(null);  
}

sets.prototype.ismember = function(skey, member) {
  return (
    {}.hasOwnProperty.call(this.memo, skey) &&   
    {}.hasOwnProperty.call(this.memo[skey], member)
  );
}
 
sets.prototype.add = function(skey, member) {
  if (this.memo[skey] === undefined) {
    this.memo[skey] = Object.create(null);
  }
  this.memo[skey][member] = 1;
}

sets.prototype.del = function(skey, member) {
  if (member === undefined) {
    delete this.memo[skey];
  }
  if (this.memo[skey] !== undefined) {
    delete this.memo[skey][member];
  }
}

sets.prototype.delAll = function() {
  this.memo = Object.create(null);  
}

sets.prototype.members = function(skey) {
  return (this.memo[skey] !== undefined) 
    ?  Object.keys(this.memo[skey])
    :  [];
}

sets.prototype.card = function(skey) {
  return this.members(skey).length;
}

sets.prototype.union = function() {
  var temp = {};
  var length = arguments.length;
  for (var i = 0; i < length; ++i) {
    var skey = arguments[i];
    if (this.memo[skey]) {
      Object.keys(this.memo[skey]).forEach(function(key) {
        temp[key] = 1;    
      });
    }
  }
  return Object.keys(temp);
}

sets.prototype.inter = function() {
  var temp = {};
  var length = arguments.length;
  for (var i = 0; i < length; ++i ) {
    var skey = arguments[i];
    if (!this.memo[skey]) return []
    Object.keys(this.memo[skey]).forEach(function(key) {
      if (!temp[key]) temp[key] = 1; 
      else temp[key] += 1;
    });
  }
  return Object.keys(temp).filter(function(key) {
    return temp[key] > length - 1;
  });
}

sets.prototype.diff = function() {
  var temp = {};
  var length = arguments.length;
  var first = this.memo[arguments[0]];
  if (!first) return [];
  else first = Object.keys(first);
  for (var i = 0; i < length; ++i ) {
    var skey = arguments[i];
    if (this.memo[skey]) {
      Object.keys(this.memo[skey]).forEach(function(key) {
        if (!temp[key]) temp[key] = 1; 
        else temp[key] += 1;
      });
    }
  }
  return Object.keys(temp).filter(function(key) {
    return temp[key] < 2 && !!~first.indexOf(key);  
  });
}

