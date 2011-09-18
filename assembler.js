
var proto = require('./lib/prototype')
  , base = require('./lib/base').connection
  , tasks = require('./tasks').tasks;

var $dm = Class.create(base, tasks, {
  // tasks is a mixin
});

// global on the server, window in the browser
var root = this;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = $dm;
} else {
    root.$dm = $dm;
}
