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
    
    it.skip('should expose when missing arguments', function() {
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
    it.skip('should expose error on settting an array', function() {
      var flag = false;
      try {
        R.set('key-a', [1,2,3]);
      } catch(e) {
        assert.ok(flag = true);
      }
      assert(flag);
    });

  });


  describe('#get()', function() {

   it.skip('should expose error when the key with type other than string', function() {
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

})

