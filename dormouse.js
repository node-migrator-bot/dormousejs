
var proto = require('./lib/prototype')
  , _ = require('underscore')._;

var dm = Class.create({
  initialize: function() {
    this.name = 'haha';
  },

  out: function() {
    console.log(this.name);
  }
});

var c = new dm();
c.out();

if (typeof window !== 'undefined' && !!window) { window.Class = Class; }
if (exports) { exports.dormouse = dm; }
