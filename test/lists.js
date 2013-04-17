var assert = require('assert');
var should = require('should');
var Redis = require('../index');


describe('lists.js', function() {

  var R = new Redis();

  beforeEach(function() {
    R.flushdb();
  });

  describe('#lpush(), #rpush(), #lindex', function() {
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

});
