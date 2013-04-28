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

});
