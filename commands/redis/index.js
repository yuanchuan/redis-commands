
var timers = require('./timers');
var check = require('./check'); 
var keys = require('./keys'); 
var strings = require('./store/strings');
var hashes = require('./store/hashes');
var lists = require('./store/lists');
var sets = require('./store/sets');
var sortedsets = require('./store/sorted-sets');
 
/**
 * A shared Redis constructor.
 */ 
module.exports = function () {
  this.__check = check;
  this.__keys = new keys();
  this.__timers = new timers();
  this.__store = {
    'string':      new strings(),
    'hash':       new hashes(),
    'list':        new lists(),
    'set':         new sets(),
    'sorted-set':  new sortedsets()
  };
}

