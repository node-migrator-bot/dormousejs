
var proto = require('./lib/prototype')
  , sys = require('sys')
  , _ = require('underscore')._;

var dm = Class.create({
  initialize: function() {
    this.sname = 'haha';
  },

  out: function() {
    console.log(sys.inspect(this.sname));
  }
});

var gm = Class.create(dm, {
  out: function($super) {
    console.log('called first');
    $super();
  }
});

var c = new gm();
c.out();

if (typeof window !== 'undefined' && !!window) { window.Class = Class; }
if (exports) { exports.dormouse = dm; }
