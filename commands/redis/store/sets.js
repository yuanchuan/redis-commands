
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
  [].forEach.call(arguments, (function(skey) {
    if (this.memo[skey]) {
      Object.keys(this.memo[skey]).forEach(function(key) {
        temp[key] = 1;    
      });
    }
  }).bind(this));
  return Object.keys(temp);
}

