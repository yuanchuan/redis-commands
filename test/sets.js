var assert = require('assert');
var should = require('should');
var Redis = require('../index');


describe('sets.js', function() {

  var R = new Redis();

  beforeEach(function() {
    R.flushdb();
  });

  describe('#sismember()', function() {
    it('should test if a member is in the given set', function() {
      R.__store.set.add('myset', 'a-member');
      assert.equal(1, R.sismember('myset', 'a-member'));
    });
    it('should return 0 if the given set does not exist', function() {
      assert.equal(0, R.sismember('badset', 'a-member'));
    });    
  });

  describe('#sadd()', function() {
    it('should return 1 and should add a member to a given set', function() {
      assert.equal(1, R.sadd('myset', 'a-member'));
      assert.equal(1, R.sismember('myset', 'a-member'));
    });
    it('should be able to add multiple members', function() {
      assert.equal(2, R.sadd('myset', 'a-member', 'b-member'));
      assert.equal(1, R.sismember('myset', 'a-member'));
      assert.equal(1, R.sismember('myset', 'b-member'));
    });
    it('should return type set', function() {
      assert.equal(1, R.sadd('myset', 'a-member'));
      assert.equal('set', R.type('myset'));
    });
  });

  describe('#srem()', function() {
    it('should be able to delete a member in a given set', function() {
      R.sadd('myset', 'a', 'b', 'c');
      assert.equal(1, R.srem('myset', 'a'));
      assert.equal(0, R.sismember('myset', 'a'));
    });
    it('should be able to delete multiple member in a given set', function() {
      R.sadd('myset', 'a', 'b', 'c');
      assert.equal(2, R.srem('myset', 'a', 'b'));
      assert.equal(0, R.sismember('myset', 'a'));
      assert.equal(0, R.sismember('myset', 'b'));
    });      
  });

  describe('#smembers()', function() {
    it('should return all members in a given set as an array', function() {
      R.sadd('myset', 'a', 'b', 'c');
      assert.equal(
        JSON.stringify(['a', 'b', 'c']),
        JSON.stringify(R.smembers('myset'))
      )
    });
    it('should return an empty array if the set does not exist', function() {
      assert.equal(
        JSON.stringify([]),
        JSON.stringify(R.smembers('myset')) 
      )
    });
    it('should expose error if the set is not of type set', function() {
      var flag = false;
      try {
        R.set('myset', 'hello');
        R.smembers('myset');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });
  });

  describe('#scard()', function() {
    it('should return the length of the members in a given set', function() {
      R.sadd('myset', 'a', 'b', 'c');
      assert.equal(3, R.scard('myset'));
    });
    it('should return 0 to a non-existed key', function() {
      assert.equal(0, R.scard('notkey'));
    });
  });

  describe('#srandmember()', function() {
    it('return number of the `count` of elements according to its sign', function() {
      R.sadd('mykey', 'a', 'b', 'c', 'd', 'e', 'f', 'a', 'b', 'x', 'y', 'z', 'w', 'o', 'p','q');
      assert.equal(5, R.srandmember('mykey', 5).length);
      assert.equal(R.scard('mykey'), R.srandmember('mykey', 100).length);
      assert.equal(5, R.srandmember('mykey', -5).length);
      assert.equal(100, R.srandmember('mykey', -100).length);
    }); 
    it('return distinct elements if the count is positive', function() {
      R.sadd('mykey', 'a', 'b', 'c', 'd', 'e', 'f', 'a', 'b', 'x', 'y', 'z', 'w', 'o', 'p','q');
      for (var i = 0; i < 100; ++i) {
        var s = R.srandmember('mykey', 5)
        var tmp = {};
        s.forEach(function(n) { tmp[n] = 1; });
        assert.equal(5, Object.keys(tmp).length)
      }
    });
    it('should return 1 random elements if the count is not given', function() {
      R.sadd('mykey', 'a', 'b', 'c');  
      var el = R.srandmember('mykey');
      assert.ok(R.sismember('mykey', el));
    });
  });

  describe('#spop()', function() {
    it('should return and remove a random element', function() {
      R.sadd('mykey', 'a', 'b', 'c', 'd', 'e');
      var el = R.spop('mykey');
      assert.ok(!R.sismember('mykey', el));
      assert.equal(4, R.scard('mykey'));
    });
  });

  describe('#smove()', function() {
    it('return 0 if the key does not exist in the first set', function() {
      R.sadd('keya', 'a', 'b', 'c');  
      R.sadd('keyb', 'x', 'y', 'z');
      assert.equal(0, R.smove('keya', 'keyb', 'm'))
    });
    it('return 0 if the key DOES exist in the second set and remove from first set', function() {
      R.sadd('keya', 'a', 'b', 'c', 'x');  
      R.sadd('keyb', 'x', 'y', 'z');
      assert.equal(0, R.smove('keya', 'keyb', 'x'))
      assert.ok(!R.sismember('keya', 'x'))
    });
    it('return 1 if the operation being done successfully', function() {
      R.sadd('keya', 'a', 'b', 'c');  
      R.sadd('keyb', 'x', 'y', 'z');
      assert.equal(1, R.smove('keya', 'keyb', 'a'))
      assert.equal(
        JSON.stringify(['b','c']),
        JSON.stringify(R.smembers('keya'))
      )
      assert.equal(
        JSON.stringify(['x','y', 'z', 'a']),
        JSON.stringify(R.smembers('keyb'))
      )
    }); 
  });

  describe('#sunion()', function() {
    it('should ignore invalid sets', function() {
      R.sadd('keya', 'a', 'b');
      assert.equal('ab', R.sunion('keya', 'x', 'y').join(""))
    });
    it('join two distinct sets', function() {
      R.sadd('keya', 'a', 'b');
      R.sadd('keyb', 'x', 'y');
      assert.equal(
        JSON.stringify(['a', 'b', 'x', 'y']),
        JSON.stringify(R.sunion('keya', 'keyb'))
      );
    });
    it('join two sets and drop duplicate members', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd');
      assert.equal(
        JSON.stringify(['a', 'b', 'c', 'd']),
        JSON.stringify(R.sunion('keya', 'keyb'))
      ); 
    });
  });

  describe('#sunionstore()', function() {
    it('should compose new set and return number of members in the new set', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd'); 
      var count = R.sunionstore('keyc', 'keya', 'keyb');
      assert.equal(4, R.scard('keyc'));
      assert.equal(
        JSON.stringify(['a', 'b', 'c', 'd']),
        JSON.stringify(R.smembers('keyc'))
      )
    });
  });

  describe('#sdiff()', function() {
    it('should ignore invalid sets', function() {
      R.sadd('keya', 'a', 'b');
      assert.equal('ab', R.sdiff('keya', 'x', 'y').join(""))
    });
    it('should return the first list if the two sets are distinct', function() {
      R.sadd('keya', 'a', 'b');
      R.sadd('keyb', 'x', 'y');
      assert.equal(
        JSON.stringify(['a', 'b']),
        JSON.stringify(R.sdiff('keya', 'keyb'))
      );
    });
    it('should return {a} to keya', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd');
      assert.equal('a', R.sdiff('keya', 'keyb').join(''))
    });
    it('should return {d} to keyb', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd');
      assert.equal('d', R.sdiff('keyb', 'keya').join(''))
    });        
  });

  describe('#sdiffstore()', function() {
    it('should compose new set and return number of members in the new set', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd'); 
      var count = R.sdiffstore('keyc', 'keya', 'keyb');
      assert.equal(1, R.scard('keyc'));
      assert.equal('a', R.smembers('keyc').join(''));
    });
  }); 

  describe('#sinter()', function() {
    it('should return empty to invalid sets', function() {
      R.sadd('keya', 'a', 'b');
      assert.equal(0, R.sinter('keya', 'x', 'y').length)
    });
    it('should return empty to two distinct sets', function() {
      R.sadd('keya', 'a', 'b');
      R.sadd('keyb', 'x', 'y');
      assert.equal(0, R.sinter('keya', 'keyb').length);
    });
    it('should return members both sets contains', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd');
      assert.equal(
        JSON.stringify(['b', 'c']),
        JSON.stringify(R.sinter('keya', 'keyb'))
      ); 
    });
    it('should be able to handle multiple sets', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd'); 
      R.sadd('keyc', 'c', 'd', 'e'); 
      assert.equal('c', R.sinter('keya', 'keyb', 'keyc').join(''));
    });
  });

  describe('#sinterstore()', function() {
    it('should compose new set and return number of members in the new set', function() {
      R.sadd('keya', 'a', 'b', 'c');
      R.sadd('keyb', 'b', 'c', 'd'); 
      var count = R.sinterstore('keyc', 'keya', 'keyb');
      assert.equal(2, R.scard('keyc'));
      assert.equal(
        JSON.stringify(['b', 'c']),
        JSON.stringify(R.smembers('keyc'))
      )
    });
  }); 

});
