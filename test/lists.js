var assert = require('assert');
var should = require('should');
var Redis = require('../index');


describe('lists.js', function() {

  var R = new Redis();

  beforeEach(function() {
    R.flushdb();
  });

  describe('#lpush(), #rpush()', function() {
    it('could store values to the key from both side', function() {
      assert.equal(6, R.lpush('mykey', 'a','b','c','d','e','f'));
      assert.equal('f', R.lindex('mykey', 0));        
      assert.equal('a', R.lindex('mykey', 5));        

      R.flushdb();
      R.rpush('mykey', 'a','b','c','d','e','f');
      assert.equal('f', R.lindex('mykey', 5));        
      assert.equal('a', R.lindex('mykey', 0));        

      R.lpush('mykey', 'z');
      assert.equal('z', R.lindex('mykey', 0));        
      assert.equal('a', R.lindex('mykey', 1));        
    });
  }); 

  describe('#lpushx(), #rpushx()', function() {
    it('should return 0 if the key does not exist', function() {
      assert.equal(0, R.lpushx('key', 1));
      assert.equal(0, R.rpushx('key', 1));
    });
  });
  
  describe('#lpop(), #rpop()', function() {
    it('could popop items from both side', function() {
      R.lpush('key', 1, 2, 3);
      assert.equal(3, R.lpop('key'));
      assert.equal(1, R.rpop('key'));
      assert.equal(2, R.lindex('key', 0));
    });
  });

  describe('#llen()', function() {
    it('should returns the length of inner container', function() {
      R.lpush('key', 1, 2, 3);
      R.rpush('key', 4, 5, 6);
      assert.equal(6, R.llen('key'));
    });
    it('should returns 0 to a non-existing key', function() {
      assert.equal(0, R.llen('unkownkey'));
    });
  });

  describe('#range()', function() {
    it('should return first 4 items', function() {
      R.lpush('key', 'c', 'b', 'a');
      R.rpush('key', 'd', 'e', 'f');
      assert.equal(
        JSON.stringify(['a', 'b', 'c', 'd']),
        JSON.stringify(R.lrange('key', 0, 3))
      );
    });
    it('should return last 4 items', function() {
      R.lpush('key', 'c', 'b', 'a');
      R.rpush('key', 'd', 'e', 'f');
      assert.equal(
        JSON.stringify(['c', 'd', 'e', 'f']),
        JSON.stringify(R.lrange('key', -4, -1))
      );
    });
    it('should return one item if the start and end are the same', function() {
      R.lpush('key', 'c', 'b', 'a');
      assert.equal(
        JSON.stringify(['a']),
        JSON.stringify(R.lrange('key', 0, 0))
      ); 
      assert.equal(
        JSON.stringify(['b']),
        JSON.stringify(R.lrange('key', 1, 1))
      );
      assert.equal(
        JSON.stringify(['c']),
        JSON.stringify(R.lrange('key', 2, 2))
      );      
    });
    it('should handles invalid indexes', function() {
      R.lpush('key', 'c', 'b', 'a');
      assert.equal(
        JSON.stringify(['b', 'c']),
        JSON.stringify(R.lrange('key', 1, 100))
      );
      assert.equal(
        JSON.stringify(['a', 'b', 'c']),
        JSON.stringify(R.lrange('key', -100, 100))
      );
    });
  });

  describe('#lindex()', function() {
    it('should return first item', function() {
      R.lpush('key', 'a');
      assert.equal('a', R.lindex('key', 0));
    });
    it('should return last item', function() {
      R.lpush('key', 'b', 'a');
      assert.equal('b', R.lindex('key', 1));
      assert.equal('b', R.lindex('key', -1));
    }); 
    it('should return null if index is out of range', function() {
      R.rpush('key', 'a', 'b');
      assert.equal(undefined, R.lindex('key', -100));
      assert.equal(undefined, R.lindex('key', 100));
    });
  });

  describe('#linsert()', function() {
    it('should insert after pivot b', function() {
      R.rpush('key', 'a', 'b', 'c');
      R.linsert('key', 'after', 'b', 'x')
      assert.equal(
        JSON.stringify(['a', 'b', 'x', 'c']),
        JSON.stringify(R.lrange('key', 0, 5))
      );
      assert.equal(4, R.llen('key'));
    });
    it('should insert before pivot b', function() {
      R.rpush('key', 'a', 'b', 'c');
      R.linsert('key', 'before', 'b', 'x')
      assert.equal(
        JSON.stringify(['a', 'x', 'b', 'c']),
        JSON.stringify(R.lrange('key', 0, 5))
      );
    }); 
    it('should return 0 to an non-existing key', function() {
      assert.equal(0, R.linsert('empty', 'before', 'hello', 'x'));
    });
    it('should return -1 to an non-existing pivot', function() {
      R.rpush('key', 'a','b');
      assert.equal(-1, R.linsert('key', 'before', 'hello', 'x'));
    }); 
  });

  describe('#lset()', function() {
    it('should set the second item`s value', function() {
      R.rpush('key', 'a', 'b', 'c');
      R.lset('key', 1, 'x');
      assert.equal('x', R.lindex('key', 1));
    });
    it('should expose error when the index is out of range', function() {
      var flag = false;
      R.rpush('key', 'a', 'b', 'c');
      try {
        R.lset('key', 100, 'x');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
    it('should expose error when the index is not integer', function() {
      var flag = false;
      R.rpush('key', 'a', 'b', 'c');
      try {
        R.lset('key', 1.3, 'x');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });     
  });

  describe('#lrem()', function() {
    it('should delete first 2 a`s', function() {
      R.rpush('key', 'a', 'b', 'c', 'a', 'a');
      assert.equal(2, R.lrem('key', 2, 'a'));
      assert.equal(
        JSON.stringify(['b', 'c', 'a']),
        JSON.stringify(R.lrange('key', 0, 3))
      );
    });

    it('should delete last 2 a`s', function() {
      R.rpush('key', 'a', 'b', 'c', 'a', 'a');
      assert.equal(2, R.lrem('key', -2, 'a'));
      assert.equal(
        JSON.stringify(['a', 'b', 'c']),
        JSON.stringify(R.lrange('key', 0, 3))
      );
    }); 
    it('should delete all a`s', function() {
      R.rpush('key', 'a', 'b', 'c', 'a', 'a');
      assert.equal(3, R.lrem('key', 0, 'a'));
      assert.equal(
        JSON.stringify(['b', 'c']),
        JSON.stringify(R.lrange('key', 0, 3))
      );
    }); 
  });

  describe('#ltrim', function() {
    it('should slice the list into first three items', function() {
      R.rpush('key', 'a', 'b', 'c', 'd', 'e', 'f', 'g');
      R.ltrim('key', 0, 2);
      assert.equal(
        JSON.stringify(['a', 'b', 'c']),
        JSON.stringify(R.lrange('key', 0, 2))
      );
    });
    it('should slice the list into last three items', function() {
      R.rpush('key', 'a', 'b', 'c', 'd', 'e', 'f', 'g');
      R.ltrim('key', -3, -1);
      assert.equal(
        JSON.stringify(['e', 'f', 'g']),
        JSON.stringify(R.lrange('key', 0, 2))
      );
    });   
  });

});
