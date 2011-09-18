
var proto = require('./lib/prototype')
  , base = require('./lib/base').connection;

var $dm = Class.create(base, tasks, {

});

// global on the server, window in the browser
var root = this;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = $dm;
} else {
    root.$dm = $dm;
}
