var assert = require('assert');
var should = require('should');
var Redis = require('../index');


describe('strings.js', function() {

  var R = new Redis();

  beforeEach(function() {
    R.__store.clear();
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(key) {
      R.set('key-' + key, key);
    });
  });

  
  describe('#set()', function() {
    
    it('should expose when missing arguments', function() {
      var flag = false;
      try {
        R.set();
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });

    it('should set a plain string', function() {
      R.set('key-a', 'aaa');
      assert.equal('aaa', R.get('key-a'));
    }); 

    it('should parse an array to json string', function() {
      R.set('key-a', [1,2,3]);
      assert.equal(R.get('key-a'), '[1,2,3]');
    });

  });

  describe('#setnx()', function() {
    it('should return 0 when the key exists', function() {
      assert.equal(0, R.setnx('key-a', 'b'));
    });
  });


  describe('#setex()', function() {
    it('should set a key and expire a key with second', function(done) {
      R.setex('key-z', 1, 'ab');
      assert.equal('ab', R.get('key-z'));
      setTimeout(function() {
        assert.ok(!R.exists('key-z'));
        done();
      }, 1000);
    });
  }); 

  describe('#psetnx()', function() {
    it('should set a key and expire a key with millisecond', function(done) {
      R.psetex('key-a', 200, 'ab');
      assert.equal('ab', R.get('key-a'));
      setTimeout(function() {
        assert.ok(!R.exists('key-a'));
        done();
      }, 200); 

    });
  }); 

  describe('#get()', function() {

   it('should expose error when the key with type other than string', function() {
      var flag = false;
      R.__types.set('key-a', 'list');
      try {
        R.get('key-a');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
 
    it('should return the value of a specified key', function() {
      assert.equal('a', R.get('key-a'));
    });

    it('should return null of a non-existing key', function() {
      assert.strictEqual(null, R.get('key-empty'));
    });

  });


  describe('#getset()', function() {
    it('should return old value of the key', function() {
      R.set('key-a', 'oldval');
      var oldval = R.getset('key-a', 'newval');
      assert.equal('oldval', oldval);
    });

    it('should return new value of the key', function() {
      R.getset('key-b', 'newval');
      assert.equal('newval', R.get('key-b'));
    });  
  });

  describe('#strlen()', function() {
    it('should return the string length of of an existing key`s value', function() {
      R.set('key-a', 'hello');
      assert.equal(5, R.strlen('key-a'));  
    });

    it('should return 0 of non-existing key', function() {
      assert.equal(0, R.strlen('nonexisting'))
    });
  });

  describe('#incrby()', function() {
    it('should return 4', function() {
      R.set('key-a', '1');
      assert.equal(4, R.incrby('key-a', 3));
    });
    it('should return -2', function() {
      R.set('key-a', '1');
      assert.equal(-2, R.incrby('key-a', -3));
    }); 
    it('should return the amount to an non-existing key', function() {
      assert.equal(2, R.incrby('key-empty', 2));  
    });
    it('should expose error with bad arguments', function() {
      var flag = false
      try {
        R.incryby();
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
    it('should expose error the type of key value not integer', function() {
      var flag = false
      try {
        R.set('key-a', 'hello');
        R.incryby('key-a', 1);
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });  
    it('should expose error the amount value not integer', function() {
      var flag = false
      try {
        R.set('key-a', 1);
        R.incryby('key-a', 2.3);
        R.incryby('key-a', 'invalid');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });  
    it('should expose error when the type of key not string', function() {
      var flag = false
      try {
        R.set('key-a', 1);
        R.__types('key-a', 'list');
        R.incrby('key-a', 1);
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });  
  });

  describe('#incr', function() {
    it('should return 1 to an non-existing key', function() {
      assert.equal(1, R.incr('key-empty'));  
    });
    it('should return 2', function() {
      R.set('key-b', 1);
      assert.equal(2, R.incr('key-b'));  
    }); 
  });

  describe('#decrby', function() {
    it('should return 2', function() {
      R.set('key-a', 4);
      assert.equal(2, R.decrby('key-a', 2));
    });
    it('should recognize hex number', function() {
      R.set('key-a', 2);
      assert.equal(3, R.incrby('key-a', 0x01));
    });    
  });

  describe('#decr', function() {
    it('should return -1 to an non-existing key', function() {
      assert.equal(-1, R.decr('key-empty'));  
    });

    it('should return 1', function() {
      R.set('key-b', 2);
      assert.equal(1, R.decr('key-b'));  
    }); 
  });
 
  describe('#incrbyfloat', function() {
    it('should return 4', function() {
      R.set('key-a', 2);
      assert.equal(4, R.incrbyfloat('key-a', 2)); 
    });
    it('should return 4.2', function() {
      R.set('key-a', 2);
      assert.equal(4.2, R.incrbyfloat('key-a', 2.2)); 
    }); 
    it('should recognize hex number', function() {
      R.set('key-a', 2);
      assert.equal(3, R.incrbyfloat('key-a', 0x01));
    });
    it('should recognize scientific notation', function() {
      R.set('key-a', 2);
      assert.equal(102, R.incrbyfloat('key-a', 1e2));
    }); 

  });

  describe('#getrange()', function() {
    it('should return specified range of string', function() {
      R.set('key-a', 'abcdefg');
      assert.equal('abc', R.getrange('key-a', 0, 2));
      assert.equal('abc', R.getrange('key-a', -7, -5));
      assert.equal('abc', R.getrange('key-a', -10, -5));
      assert.equal('abc', R.getrange('key-a', -10, -5));
      assert.equal('abc', R.getrange('key-a', 0, -5));
      assert.equal('fg', R.getrange('key-a', -2, 100));
      assert.equal('', R.getrange('key-a', 20, 100));
      assert.equal('', R.getrange('key-a', 100, -2));
    });
  });

  describe('#append()', function() {
    it('should handle non-existing key', function() {
      assert.equal('abc', R.append('key-empty', 'abc'));  
    });
    it('should append new string to a key', function() {
      R.set('key-a', 'abc');
      assert.equal('abcdef', R.append('key-a', 'def'));  
    }); 
  });
  
})

