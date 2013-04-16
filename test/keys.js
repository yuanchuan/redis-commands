
var assert = require('assert');
var should = require('should');
var Redis = require('../index');


describe('Keys.js', function() {

  var R = new Redis();
  beforeEach(function() {
    R.flushdb();
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(key) {
      R.set('key-' + key, key)
    });
  });

  describe('#exists()', function() {
    it('should returns 1 to an existed key', function() {
      assert.strictEqual(1, R.exists('key-a'));
    })
    it('should returns 0 to an unkown key', function(){
      assert.strictEqual(0, R.exists('key-unkown'));
    }) 
  })

  describe('#del()', function() {
    it('should be able to delete a single key', function() {
      R.del('key-a');
      assert.equal(0, R.exists('key-a'))  
    })
    it('should returns 1 of the single deleted key', function() {
      var single = R.del('key-b');
      assert.equal(1, single)  
    }) 
    it('should be able to delete multiple key', function() {
      R.del('key-a', 'key-b', 'key-c');
      assert.equal(0, R.exists('key-a'))  
      assert.equal(0, R.exists('key-b'))  
      assert.equal(0, R.exists('key-c'))  
    }) 
    it('should returns 3 number of the multiple deleted key', function() {
      var multiple = R.del('key-a', 'key-b', 'key-c');
      assert.equal(3, multiple)  
    }) 
    it('should returns 2 number of 2 successfully deleted existed key and an unkown key', function() {
      var multiple = R.del('key-a', 'key-b', 'key-unkown');
      assert.equal(2, multiple)  
    })    
  });

  describe('#keys()', function() {
    it('should returns key-a', function() {
      var key = R.keys('*-a');  
      assert.equal('key-a', key);
    });
    it('should returns all keys', function() {
      var key = R.keys('key-*');  
      R.__keys.all().should.have.lengthOf(26);

      key = R.keys('k?y');  
      R.__keys.all().should.have.lengthOf(26);
    });      
  });

  describe('#randomkey()', function() {
    it('should returns a key', function() {
      var key = R.randomkey();
      R.__keys.all().should.include(key);
    });
  });

  describe('#pexpire()', function() {
    it('should expires a key with millisecond', function(done) {
      R.pexpire('key-a', 100);    
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 120);
    });
    it('should converts negative millisecond to 0, expire immediately', function(done) {
      R.pexpire('key-a', -200);    
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 0);
    });         
    it('should resets timers', function(done) {
      R.pexpire('key-a', 200);
      setTimeout(function() {
        R.pexpire('key-a', 200);
        assert.ok(R.pttl('key-a') > 150);
        done();
      }, 100);
    });
    it('should exposes error with bad arguments', function() {
      var flag = false;
      try {
        R.pexpire('key-a','2dfsdf');
      } catch(e) {
        assert.ok(flag = true);  
      }
      assert.ok(flag);
    });
    it('should exposes error with float value', function() {
      var flag = false;
      try {
        R.pexpire('key-a','2.34');
      } catch(e) {
        assert.ok(flag = true);  
      }
      assert.ok(flag);
    });
    it('should exposes error with missing arguments', function() {
      var flag = false;
      try {
        R.pexpire('key-a');
      } catch(e) {
        assert.ok(flag = true);  
      }
      assert.ok(flag);
    }); 
  });

  describe('#expire()', function() {
    it('should expires a key with second', function(done) {
      R.expire('key-a', 1);
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 1000);
    });
  });

  describe('#pexpireat()', function() {
    it('should expires a key with a unix time in millisecond', function(done) {
      R.pexpireat('key-a', Date.now() + 200);
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 200);
    });
  });

  describe('#expireat()', function() {
    it('should expires a key with a unix time in second', function(done) {
      R.pexpireat('key-a', Date.now() + 1);
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 1000);
    });
  });         

  describe('#pttl()', function() {
    it('should returns the time left of an expiring key in millisecond', function(done) {
      R.pexpire('key-a', 200);    
      setTimeout(function() {
        assert.ok(Math.abs(100 - R.pttl('key-a')) < 2);
        done();
      }, 100);
    });
    it('should returns -2 if a key does not exist', function() {
      assert.equal(-2, R.pttl('key-unkown'));
    }); 
    it('should returns -1 if a key does not expiring', function() {
      assert.equal(-1, R.pttl('key-b'));
    });         
  });

  describe('#ttl()', function() {
    it('should returns the time left of an expiring key in second', function(done) {
      R.expire('key-b', 2);    
      setTimeout(function() {
        assert.equal(1, R.ttl('key-b'));
        done();
      }, 1000);
    });
    it('should returns 1 if the time is less than a second', function(done) {
      R.expire('key-c', 1);    
      setTimeout(function() {
        assert.equal(1, R.ttl('key-c'));
        done();
      }, 100); 
    }); 
  });
       
  describe('#persist()', function() {
    it('should makes an expiring key persist', function(done) {
      R.pexpire('key-a', 100);  
      R.persist('key-a');
      setTimeout(function() {
        assert.equal(1, R.exists('key-a'));  
        done();
      }, 200);
    });
  });

  describe('#rename()', function() {
    it('should renames two existed keys', function() {
      R.rename('key-a', 'key-b');
      assert.equal(0, R.exists('key-a'));
      assert.equal('a',  R.get('key-b'));
    });
    it('should exposes error when the first key does not exist', function() {
      var flag = false;
      try {
        R.rename('key-unkown', 'key-b');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });  
    it('should exposes error when the two keys are the same', function() {
      var flag = false;
      try {
        R.rename('key-a', 'key-a');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    });      
    it('should transfers the timer to the new key if set', function() {
      R.expire('key-a', 5);
      R.rename('key-a', 'key-x')
      assert.ok( R.ttl('key-x') > 0);
      assert.equal(-2, R.ttl('key-a'));
    });
  });

  describe('#renamenx()', function() {
    it("should returns 1 if key was renamed to newkey", function() {
      assert.equal(1, R.renamenx('key-a', 'key-new'));
    });
    it("should returns 0 if newkey already exists", function() {
      assert.equal(0, R.renamenx('key-a', 'key-b'));
    });     
    it('should exposes error as in rename', function() {
      var flag = false;
      try {
        R.renamenx('key-a', 'key-a');
      } catch(e) {
        assert.ok(flag = true);
      }
      assert.ok(flag);
    }); 
  });

})

