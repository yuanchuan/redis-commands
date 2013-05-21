#!/usr/bin/env node

var Redis = require('./');
var R = new Redis();
var repl = require('repl');

var server = repl.start({
  'prompt': 'redis-commands> ',
  eval: function(cmd, context, filename, callback) {
    var input = cmd
      .replace(/^\(|\)$|\n/g, '')
      .split(/\s+/)
      .filter(function(n) { return n.length })

    var command = input[0];

    if (command && command.length) {
      if (R[command]) {
        try {  
          result = R[command].apply(R, input.slice(1))
          callback(result === undefined ? grey('OK'): result);
        } catch (e) {
          callback(red('Error: ' + e.message));
        }
      } else {
        callback(red('Error: ' + 'unknown command ' + command));
      }
    } else {
      callback();
    }
  }
});

for (var command in R) {
  server.context[command] = R[command];
}
 
function grey(str) {
  return '\033[90m' + str + '\033[39m';
}

function red(str) {
  return '\033[31m' + str + '\033[39m';
}
