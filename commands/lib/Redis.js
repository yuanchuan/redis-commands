
/**
 * A shared Redis constructor.
 */
module.exports = function() {
  this.__store = require('./store');
  this.__timers = require('./timers');
  this.__types = require('./types');
}

