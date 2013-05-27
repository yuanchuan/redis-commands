# Redis-commands

Redis commands implemented in JavaScript.

** NOTICE ** This is just an experimental project for fun and learning. I don't expect it to be useful anyway.

## Installation

```bash
$ npm install redis-commands
```

## Example

```js

var Redis = require('redis-commands');
var R = new Redis();

R.set('mykey', 'hello');
R.get('mykey');
```

##TODO

* Sorted-sets
* More tests
* Optimize 
* Migrate to browser


## License
MIT
