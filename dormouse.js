
var proto = require('./lib/prototype')
  , util = require('util')
  , _ = require('underscore')._;

var dm = Class.create({
  initialize: function() {
    this.sname = 'haha';
  },

  out: function() {
    console.log(this.sname);
  }
});

var gm = Class.create(dm, {
  out: function($super) {
    console.log('called first');
    $super.call(this);
  }
});

var c = new gm();
c.out();

if (typeof window !== 'undefined' && !!window) { window.Class = Class; }
if (exports) { exports.dormouse = dm; }
