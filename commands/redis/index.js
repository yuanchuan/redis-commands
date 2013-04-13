
var store = require('./store');
var timers = require('./timers');
var types = require('./types');
var check = require('./check'); 
 
/**
 * A shared Redis constructor.
 */ 
module.exports = function () {
  this.__store = new store();
  this.__timers = new timers();
  this.__types = new types();
  this.__check = check;
}

