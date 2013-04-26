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
  });

});
