
var timers = require('./timers');
var check = require('./check'); 
 
/**
 * A shared Redis constructor.
 */ 
module.exports = function () {
  this.__keys = Object.create(null);
  this.__timers = new timers();
  this.__check = check;
}

