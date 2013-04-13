
var errors = require('./errors');

module.exports = function(args) {
  var self = this;
  return {
    whether: function() {
      [].slice.call(arguments).forEach((function(handler) {
        var errorHandler = errors[(handler||'').trim()];
        if (errorHandler) {
          errorHandler.apply(this, args);  
        }
      }).bind(self)); 
    }
  };
}

