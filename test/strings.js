var assert = require('assert');
var should = require('should');
var Redis = require('../index');


describe('strings.js', function() {

  var R = new Redis();

  beforeEach(function() {
    R.flushdb();
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(key) {
      R.set('key-' +key, key);
    });
  });

  describe('#set()', function() {
    it('should exposes when missing arguments', function() {
      var flag = false;
      try {
        R.set();
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
    it('should sets a plain string', function() {
      R.set('key-a', 'aaa');
      assert.equal('aaa', R.get('key-a'));
    }); 
    it('should parses an array to json string', function() {
      R.set('key-a', [1,2,3]);
      assert.equal(R.get('key-a'), '[1,2,3]');
    });
  });

  describe('#setnx()', function() {
    it('should returns 0 when the key exists', function() {
      assert.equal(0, R.setnx('key-a', 'b'));
    });
    it('should returns 1 when the key has been set', function() {
      assert.equal(1, R.setnx('key-empty', 'b'));
      assert.equal('b', R.get('key-empty'));
    }); 
  });

  describe('#setex()', function() {
    it('should sets a key and expire a key with second', function(done) {
      R.setex('key-mykey', 1, 'ab');
      assert.equal('ab', R.get('key-mykey'));
      setTimeout(function() {
        assert.equal(0, R.exists('key-mykey'));
        done();
      }, 1000);
    });
  }); 

  describe('#psetnx()', function() {
    it('should sets a key and expire a key with millisecond', function(done) {
      R.psetex('key-a', 200, 'ab');
      assert.equal('ab', R.get('key-a'));
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 200); 
    });
  }); 

  describe('#get()', function() {
   it('should exposes error when the key with type other than string', function() {
      var flag = false;
      R.__keys.set('key-a', 'list');
      try {
        R.get('key-a');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
    it('should returns the value of a specified key', function() {
      assert.equal('a', R.get('key-a'));
    });
    it('should returns null of a non-existing key', function() {
      assert.strictEqual(null, R.get('key-empty'));
    });
  });

  describe('#getset()', function() {
    it('should returns old value of the key', function() {
      R.set('key-a', 'oldval');
      var oldval = R.getset('key-a', 'newval');
      assert.equal('oldval', oldval);
    });
    it('should returns new value of the key', function() {
      R.getset('key-b', 'newval');
      assert.equal('newval', R.get('key-b'));
    });  
  });

  describe('#mget()', function() {
    it('should returns multiple value as an array', function() {
      assert.equal(
        JSON.stringify(R.mget('key-a', 'key-b', 'key-c')),
        JSON.stringify(['a','b','c'])
      );
      assert.equal(
        JSON.stringify(R.mget('key-a', 'key-b', 'key-empty')),
        JSON.stringify(['a','b',null])
      );
    });
  });

  describe('#mset', function() {
    it('should handles odd number of arguments', function() {
      var flag = false;
      try {
        R.mset('key-a', 'key-a', 'key-b');
      } catch (e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
    it('should sets multiple key at once', function() {
      R.mset('key-a', 'aa', 'key-b', 'bb');
      assert.equal('aa', R.get('key-a'));
      assert.equal('bb', R.get('key-b'));
    });
  });

  describe('#msetnx', function() {
    it('should returns 0 on setting value to an existing key', function() {
      assert.equal(0, R.msetnx('key-a', 'a', 'key-empty', 'empty'));
    });
  });

  describe('#strlen()', function() {
    it('should returns the string length of of an existing key`s value', function() {
      R.set('key-a', 'hello');
      assert.equal(5, R.strlen('key-a'));  
    });
    it('should returns 0 of non-existing key', function() {
      assert.equal(0, R.strlen('nonexisting'))
    });
  });

  describe('#incrby()', function() {
    it('should returns 4', function() {
      R.set('key-a', '1');
      assert.equal(4, R.incrby('key-a', 3));
    });
    it('should returns -2', function() {
      R.set('key-a', '1');
      assert.equal(-2, R.incrby('key-a', -3));
    }); 
    it('should returns the amount to an non-existing key', function() {
      assert.equal(2, R.incrby('key-empty', 2));  
    });
    it('should exposes error with bad arguments', function() {
      var flag = false
      try {
        R.incryby();
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
    it('should exposes error the type of key value not integer', function() {
      var flag = false
      try {
        R.set('key-a', 'hello');
        R.incryby('key-a', 1);
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });  
    it('should exposes error the amount value not integer', function() {
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
    it('should exposes error when the type of key not string', function() {
      var flag = false
      try {
        R.set('key-a', 1);
        R.__keys.set('key-a', 'list');
        R.incrby('key-a', 1);
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });  
  });

  describe('#incr', function() {
    it('should returns 1 to an non-existing key', function() {
      assert.equal(1, R.incr('key-empty'));  
    });
    it('should returns 2', function() {
      R.set('key-b', 1);
      assert.equal(2, R.incr('key-b'));  
    }); 
  });

  describe('#decrby', function() {
    it('should returns 2', function() {
      R.set('key-a', 4);
      assert.equal(2, R.decrby('key-a', 2));
    });
    it('should recognize hex number', function() {
      R.set('key-a', 2);
      assert.equal(3, R.incrby('key-a', 0x01));
    });    
  });

  describe('#decr', function() {
    it('should returns -1 to an non-existing key', function() {
      assert.equal(-1, R.decr('key-empty'));  
    });
    it('should returns 1', function() {
      R.set('key-b', 2);
      assert.equal(1, R.decr('key-b'));  
    }); 
  });
 
  describe('#incrbyfloat', function() {
    it('should returns 4', function() {
      R.set('key-a', 2);
      assert.equal(4, R.incrbyfloat('key-a', 2)); 
    });
    it('should returns 4.2', function() {
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
    it('should returns specified range of string', function() {
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

  describe('#setrange()', function() {
    it('should exposes error with negative offset', function() {
      var flag = false;
      try {
        R.setrange('key-a', -2, 'substring');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
    it('should sets range properly', function() {
      R.set('key-a', 'abcdefg');
      R.setrange('key-a', 2, 'xyz')
      assert.equal('abxyzfg', R.get('key-a'));

      R.set('key-a', 'abcdefg');
      R.setrange('key-a', 0, 'xyz')
      assert.equal('xyzdefg', R.get('key-a'));
 
      R.set('key-a', 'abcdefg');
      R.setrange('key-a', 7, 'xyz')
      assert.equal('abcdefgxyz', R.get('key-a'));
       
      R.set('key-a', 'abcdefg');
      R.setrange('key-a', 8, 'xyz');
      assert.equal('abcdefg\u0000xyz', R.get('key-a'));

      R.set('key-a', 'abcdefg');
      R.setrange('key-a', 9, 'xyz');
      assert.equal('abcdefg\u0000\u0000xyz', R.get('key-a')); 

      R.set('key-a', 'abcdefg');
      assert.equal(103, R.setrange('key-a', 100, 'xyz'));    
    });
  });

  describe('#append()', function() {
    it('should handles non-existing key', function() {
      assert.equal('abc', R.append('key-empty', 'abc'));  
    });
    it('should appends new string to a key', function() {
      R.set('key-a', 'abc');
      assert.equal('abcdef', R.append('key-a', 'def'));  
    }); 
  });
  
})

