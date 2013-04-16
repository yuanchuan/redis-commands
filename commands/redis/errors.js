
module.exports = {

  'missing_1st': function() {
    if (arguments.length < 1) {
      throw Error("Wrong number of arguments");
    }
  },

  'missing_1st_or_2nd': function() {
    if (arguments.length < 2) {
      throw Error("Wrong number of arguments");
    }
  },

  'missing_1st_to_3rd': function() {
    if (arguments.length < 3) {
      throw Error("Wrong number of arguments");
    }
  },

  '1st_not_exist': function() {
    if (!this.exists(arguments[0])) {
      throw Error('No such key');
    }
  },
 
  '1st_and_2nd_equal': function() {
    if (arguments[0] === arguments[1]) {
      throw Error("Source and destination objects are the same");
    }
  },

  '2nd_not_integer': function() {
    var arg = arguments[1];
    if (isNaN(+arg) || arg % 1 !== 0) {
      throw Error('Value is not an integer or out of range');
    }
  },

  '3rd_not_integer': function() {
    var arg = arguments[2];
    if (isNaN(+arg) || arg % 1 !== 0) {
      throw Error('Value is not an integer or out of range');
    }
  },
 
  'key_type_not_string': function() {
    var key = arguments[0];
    if (this.exists(key) && this.type(key) !== 'string') {
      throw Error('Operation against a key holding the wrong kind of value');  
    } 
  },
 
  'key_type_not_hash': function() {
    var key = arguments[0];
    if (this.exists(key) && this.type(key) !== 'hash') {
      throw Error('Operation against a key holding the wrong kind of value');  
    } 
  }, 

  'key_val_not_integer': function() {
    var key = arguments[0];
    if (this.exists(key)) {
      var val = this.get(key);
      if (isNaN(+val) || val % 1 !== 0) {
        throw Error('Value is not an integer or out of range');
      }
    }
  },
             
  'key_val_not_number': function() {
    var key = arguments[0]
    if (this.exists(key)) {
      var val = this.get(key);
      if (isNaN(+val)) {
        throw Error('Value is not a valid float');
      }
    }
   },

  '2nd_not_number': function() {
    if (isNaN(+arguments[1])) {
      throw Error('Value is not a valid float');
    }
  },

  '3rd_not_number': function() {
    if (isNaN(+arguments[2])) {
      throw Error('Value is not a valid float');
    }
  }, 
  
  'odd_args': function() {
    if (arguments.length < 1 || arguments.length % 2 !== 0) {
      throw Error('Wrong number of arguments');
    }
  },

  '2nd_negative': function() {
    if (arguments[1] < 0) {
      throw Error('Value out of range');
    }
  },

  'even_args': function() {
    if (arguments.length % 2 === 0) {
      throw Error('Wrong number of arguments');
    }
  },

  'field_val_not_integer': function() {
    var hkey = arguments[0];
    var field = arguments[1];
    if (this.hexists(hkey, field)) {
      var val = this.hget(hkey, field);
      if (isNaN(+val) || val % 1 !== 0) {
        throw Error('Value is not an integer or out of range');
      }
    }
  },    

  'field_val_not_number': function() {
    var hkey = arguments[0];
    var field = arguments[1];
    if (this.hexists(hkey, field)) {
      var val = this.hget(hkey, field);
      if (isNaN(+val)) {
        throw Error('Value is not an integer or out of range');
      }
    }
  }

}

