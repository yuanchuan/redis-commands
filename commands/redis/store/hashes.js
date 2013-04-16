
var hashes = module.exports = function() {
  this.memo = Object.create(null);  
}

hashes.prototype.exists = function(hkey, field) {
  return (
    {}.hasOwnProperty.call(this.memo, hkey) &&   
    {}.hasOwnProperty.call(this.memo[hkey], field)
  );
}
 
hashes.prototype.set = function(hkey, field, val) {
  if (this.memo[hkey] === undefined) {
    this.memo[hkey] = Object.create(null);
  }
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
  }
  this.memo[hkey][field] = val;
}

hashes.prototype.get = function(hkey, field) {
  if (this.memo[hkey] !== undefined) {
    return this.memo[hkey][field];
  }
}

hashes.prototype.del = function(hkey, field) {
  if (this.memo[hkey] !== undefined) {
    delete this.memo[hkey][field];
  }
}

hashes.prototype.delAll = function() {
  this.memo = Object.create(null);  
}

hashes.prototype.fields = function(hkey) {
  if (this.memo[hkey] !== undefined) {
    return Object.keys(this.memo[hkey]);
  }
}

