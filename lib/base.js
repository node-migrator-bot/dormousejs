
var path = require('path')
  , _ = require('underscore')._;

var DM_URL = 'http://dormou.se';

var connection = Class.create({

  initialize: function() {

  },

  get: function(path, callback) {
    var request = new XMLHttpRequest();
  },

  post: function(path, callback) {

  },

  getIds: function() {
    var ids = libutils.toArray(arguments)
      , get_path = ids.unshift()
      , callback = ids.pop();
    if (libutils.isEmpty(ids)) {
      // XXX TODO implementation
      return this.get(get_path, callback);
    }
  }

});

exports.connection = connection;
exports.DM_BASE = DM_BASE;
