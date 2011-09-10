
var proto = require('./lib/prototype')
  , base = require('./lib/base').connection;

var $dm = Class.create(base, tasks, {

});

if (window) { window.$dm = $dm; }
if (exports) { exports.$dm = $dm; }
