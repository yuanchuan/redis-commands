var assert = require('assert');
var should = require('should');
var Redis = require('../index');


describe('hashes.js', function() {

  var R = new Redis();

  beforeEach(function() {
    R.flushdb();
    R.hset('mykey', 'name', 'Chuan');
  });

  describe('#hexists()', function() {
    it('should exposes error to the key of other than type hash', function() {
      var flag = false;
      R.set('key', 'hello');
      try {
        R.hexists('key', 'hello');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    }); 
    it('should returns 1 to an existing field in the key', function() {
      assert.equal(1, R.hexists('mykey', 'name'));
    });
    it('should returns 0 to an none-existing field in the key', function() {
      assert.equal(0, R.hexists('mykey', 'empty'));
    }); 
  });

  describe('#hset()', function() {
    it('should sets a field', function() {
      assert.equal('Chuan', R.hget('mykey', 'name'));
      R.hset('mykey', 'name', 'new Chuan');
      assert.equal('new Chuan', R.hget('mykey', 'name'));
    });
    it('should returns 1 when the field is new', function() {
      assert.equal(1, R.hset('mykey', 'newname', 'Chuan')); 
    }); 
    it('should returns 0 when the field is exisiting', function() {
      assert.equal(0, R.hset('mykey', 'name', 'new Chuan')); 
    }); 
  });

  describe('#hsetnx()', function() {
    it('should returns 0 if the key is existing and failed to set', function() {
      assert.equal(0, R.hsetnx('mykey', 'name', 'new Chuan'));
      assert.equal('Chuan', R.hget('mykey', 'name'));
    }) 
  });

  describe('#hget()', function() {
    it('should returns the value of the field in the key', function() {
      assert.equal('Chuan', R.hget('mykey', 'name'));
    });
    it('should returns null to a non-existing field or key', function() {
      assert.equal(null, R.hget('empty', 'empty'));
      assert.equal(null, R.hget('mykey', 'empty'));
    });
  });

  describe('#hdel()', function() {
    it('should deletes a field in a key', function() {
      R.hdel('mykey', 'name');
      assert.equal(0, R.hexists('mykey', 'name'));
    });
    it('should returns 2 if deleting 2 filed in the key successfully', function() {
      R.hset('mykey', 'a', 'aa');
      R.hset('mykey', 'b', 'bb');
      assert.equal(2, R.hdel('mykey', 'a', 'b'));
    });
    it('should returns 0 if no field in the key is deleted', function() {
      assert.equal(0, R.hdel('mykey', 'x', 'y', 'z'));  
    });
  });

  describe('#hkeys()', function() {
    it('should returns all the fields in the key', function() {
      R.hmset('newkey', 'a', 'aa', 'b', 'bb', 'c', 'cc');  
      assert.equal(
        JSON.stringify(['a', 'b', 'c']),
        JSON.stringify(R.hkeys('newkey'))
      )
    });
  });

  describe('#hvals()', function() {
    it('should returns all the value of fields in the key', function() {
      R.hmset('newkey', 'a', 'aa', 'b', 'bb', 'c', 'cc');  
      assert.equal(
        JSON.stringify(['aa', 'bb', 'cc']),
        JSON.stringify(R.hvals('newkey'))
      )
    });
  });
            
  describe('#hgetall()', function() {
    it('should returns all the fields and values in the key', function() {
      R.hmset('newkey', 'a', 'aa', 'b', 'bb', 'c', 'cc');  
      assert.equal(
        JSON.stringify(['a', 'aa', 'b', 'bb', 'c', 'cc']),
        JSON.stringify(R.hgetall('newkey'))
      )
    });
  });

  describe('#hlen()', function() {
    it('should returns the number of fields contained in the hash stored at key', function() {
      R.hmset('newkey', 'a', 'aa', 'b', 'bb', 'c', 'cc');  
      assert.equal(3, R.hlen('newkey'));  
    });
  });

  describe('#hmset', function() {
    it('should sets multiple field with value', function() {
      R.hmset('newkey', 'a', 'aa', 'b', 'bb', 'c', 'cc');  
      assert.equal('aa', R.hget('newkey', 'a'));
      assert.equal('bb', R.hget('newkey', 'b'));
      assert.equal('bb', R.hget('newkey', 'b'));
    });
  });

  describe('#hmset', function() {
    it('should returns multiple values of fields', function() {
      R.hmset('newkey', 'a', 'aa', 'b', 'bb', 'c', 'cc');  
      assert.equal(
        JSON.stringify(['aa', 'bb', 'cc']),
        JSON.stringify(R.hmget('newkey', 'a', 'b', 'c'))
      );
    });
  }); 

  describe('#hincrby', function() {
    it('should increases by a given number to the value of field in the key', function() {
      R.hset('newkey', 'num', 1);    
      assert.equal(3, R.hincrby('newkey', 'num', 2));
    });
    it('should accepts negative number', function() {
      R.hset('newkey', 'num', 3);
      assert.equal(1, R.hincrby('newkey', 'num', -2));
    });
    it('should creates new field if the given field is not existed', function() {
      assert.equal(2, R.hincrby('mykey', 'newnum', 2));
      assert.equal(2, R.hget('mykey', 'newnum'));
    });
    it('should exposes error when the value of the field is not integer', function() {
      var flag = false;
      try {
        R.hincrby('mykey','name', 2);
      } catch (e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
  });

  describe('#hincrbyfloat', function() {
    it('should returns 4', function() {
      R.hset('newkey', 'num', 2);
      assert.equal(4, R.hincrbyfloat('newkey', 'num', 2)); 
    });
    it('should returns 4.2', function() {
      R.hset('newkey', 'num', 2);
      assert.equal(4.2, R.hincrbyfloat('newkey', 'num', 2.2)); 
    }); 
    it('should recognizes hex number', function() {
      R.hset('newkey', 'num', 2);
      assert.equal(3, R.hincrbyfloat('newkey', 'num', 0x01));
    });
    it('should recognizes scientific notation', function() {
      R.hset('newkey', 'num', 2);
      assert.equal(102, R.hincrbyfloat('newkey','num', 1e2));
    });       
  }); 

});
