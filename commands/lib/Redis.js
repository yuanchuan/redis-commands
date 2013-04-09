
/**
 * A shared Redis constructor.
 */
module.exports = function() {
  this.__store = Object.create(null);
  this.__type;
}

