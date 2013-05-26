#!/usr/bin/env node

var repl = require('repl');
var Redis = new (require('./'))();

var wrap = {
  string: function (string) {
    return '"' + string + '"'; 
  },
  integer: function(integer) {
    return '(integer) ' + integer; 
  },
  array: function(array) {
    if (!array.length) return '(empty list or set)'; 
    return array.map(function(item, i) {
      return (i + 1) + ') ' + wrap.string(item);
    }).join('\n'); 
  },
  nil: function(nil) {
    return '(nil)';
  },
  error: function(error) {
    return '(error) ' + error;
  }
};

var format = function(output) {
  var ret = '';
  if ( Array.isArray(output)) {
    ret = wrap.array(output);
  } else if (Object.prototype.toString.call(output) === '[object String]') {
    ret = wrap.string(output);
  } else if (Object.prototype.toString.call(output) === '[object Number]') {
    ret = wrap.integer(output);
  } else if (null === output) {
    ret = wrap.nil(output);
  } else if (undefined === output) {
    ret = 'OK';  
  }
  return ret;
}
 
var options = {};
options.prompt = 'redis-commands> ';
options.ignoreUndefined = true;

options.eval = function(input, context, filename, callback) {
  var command = input
    .replace(/^\(|\)$|\n/g, '')
    .trim()
    .split(/\s+/)
    .map(function(n) { 
      return isNaN(+n) ? n : +n;
    });
  var head = command[0];
  if (head && command.length) {
    if (Redis[head]) {
      try {  
        callback(format(
          Redis[head].apply(Redis, command.slice(1))
        ));
      } catch (e) {
        callback(
          wrap.error(e.message)
        );
      }
    } else {
      callback(
        wrap.error('unknown command ') + 
        wrap.string(head)
      );
    }
  } else {
    callback();
  }
};  


var server = repl.start(options);
for (var s in server.context) {
  delete server.context[s];
}
// vm.createContext(Redis) is not enough, so..
for (var command in Redis) {
  server.context[command] = Redis[command];
}  

process.stdin.on('keypress', function(s, key) {
  if (key && key.ctrl && key.name == 'l') {
    process.stdout.write('\u001B[2J\u001B[0;0f'+server.prompt);
  }
});

