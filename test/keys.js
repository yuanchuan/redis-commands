var assert = require('assert');
var should = require('should');
var Redis = require('../commands/keys');


describe('Keys.js', function() {

  var R = new Redis();

  beforeEach(function() {
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(key) {
      R.__store['key-' + key] = key;
    });
  });

  describe('#exists()', function() {
    it('should return 1 to an existed key', function() {
      assert.strictEqual(1, R.exists('key-a'));
    })

    it('should return 0 to an unkown key', function(){
      assert.strictEqual(0, R.exists('key-unkown'));
    }) 

  })

  describe('#del()', function() {
   
    it('should be able to delete a single key', function() {
      R.del('key-a');
      assert.equal(0, R.exists('key-a'))  
    })

    it('should return 1 of the single deleted key', function() {
      var single = R.del('key-b');
      assert.equal(1, single)  
    }) 

    it('should be able to delete multiple key', function() {
      R.del('key-a', 'key-b', 'key-c');
      assert.equal(0, R.exists('key-a'))  
      assert.equal(0, R.exists('key-b'))  
      assert.equal(0, R.exists('key-c'))  
    }) 

    it('should return 3 number of the multiple deleted key', function() {
      var multiple = R.del('key-a', 'key-b', 'key-c');
      assert.equal(3, multiple)  
    }) 

    it('should return 2 number of 2 successfully deleted existed key and an unkown key', function() {
      var multiple = R.del('key-a', 'key-b', 'key-unkown');
      assert.equal(2, multiple)  
    })    

  });


  describe('#keys()', function() {

    it('should return key-a', function() {
      var key = R.keys('*-a');  
      assert.equal('key-a', key);
    });

    it('should return all keys', function() {
      var key = R.keys('key-*');  
      Object.keys(R.__store).should.have.lengthOf(26);
    });

    it('should return all keys', function() {
      var key = R.keys('k?y');  
      Object.keys(R.__store).should.have.lengthOf(26);
    });      

  });

 
  describe('#randomkey()', function() {
    it('should return a key', function() {
      var key = R.randomkey();
      Object.keys(R.__store).should.include(key);
    });
  });

 
  describe('#pexpire()', function() {
    it('should expire a key with millionsecond', function(done) {
      R.pexpire('key-a', 200);    
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 200);
    });

    it('should convert negative millionsecond to 0, expire immediately', function(done) {
      R.pexpire('key-a', -200);    
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 0);
    });         
  });

  
  describe('#expire()', function() {
    it('should expire a key with second', function(done) {
      R.expire('key-a', 1);
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 1000);
    });
  });


  describe('#pexpireat()', function() {
    it('should expire a key with a unix time in millionsecond', function(done) {
      R.pexpireat('key-a', Date.now() + 200);
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 200);
    });
  });

  describe('#expireat()', function() {
    it('should expire a key with a unix time in second', function(done) {
      R.pexpireat('key-a', Date.now() + 1);
      setTimeout(function() {
        assert.equal(0, R.exists('key-a'));
        done();
      }, 1000);
    });
  });         


  describe('#pttl()', function() {
    it('should return the time left of an expiring key in millionsecond', function(done) {
      R.pexpire('key-a', 200);    
      setTimeout(function() {
        assert.ok(Math.abs(100 - R.pttl('key-a')) < 2);
        done();
      }, 100);
    });

    it('should return -2 if a key does not exist', function() {
      assert.equal(-2, R.pttl('key-unkown'));
    }); 

    it('should return -1 if a key does not expiring', function() {
      assert.equal(-1, R.pttl('key-b'));
    });         
  });


  describe('#ttl()', function() {
    it('should return the time left of an expiring key in second', function(done) {
      R.expire('key-b', 2);    
      setTimeout(function() {
        assert.equal(1, R.ttl('key-b'));
        done();
      }, 1000);
    });

    it('should return 1 if the time is less than a second', function(done) {
      R.expire('key-c', 1);    
      setTimeout(function() {
        assert.equal(1, R.ttl('key-c'));
        done();
      }, 100); 
      
    }); 
             
  });
       

  describe('#persist()', function() {
    it('should make an expiring key persist', function(done) {
      R.pexpire('key-a', 100);  
      R.persist('key-a');
      setTimeout(function() {
        assert.equal(1, R.exists('key-a'));  
      }, 120);
      done();
    });
  });


  describe('#rename()', function() {
    it('should rename two existed keys', function() {
      R.rename('key-a', 'key-b');
      assert.equal(0, R.exists('key-a'));
      assert.equal('a',  R.__store['key-b']);
    });

    it('should expose error when the first key does not exist', function() {
      try {
        R.rename('key-unkown', 'key-b');
      } catch(e) {
        assert.ok(true);
      }
    });  

    it('should expose error when the two keys are the same', function() {
      try {
        R.rename('key-a', 'key-a');
      } catch(e) {
        assert.ok(true);
      }
    });      

    it('should transfer the timer to the new key if set', function() {
      R.expire('key-a', 5);
      R.rename('key-a', 'key-x')
      assert.ok( R.ttl('key-x') > 0);
      assert.equal(-2, R.ttl('key-a'));
    });

  });
 
})

