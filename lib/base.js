
var path = require('path')
  , _ = require('underscore')._
  , libutils = require('./utils');

var DM_URL = 'http://dormou.se';

var connection = Class.create({

  initialize: function() {

  },

  /**
   * @param options serialized in GET params, optional
   */
  get: function(path, options, callback) {
    // XXX TODO implementation
    var request = new XMLHttpRequest();
  },

  /**
   * @param options dumped in POST body, optional
   */
  post: function(path, options, callback) {
    // XXX TODO implementation
  },

  /**
   * @param options is optional
   */
  put: function(path, options, callback) {
    // XXX TODO implementation
  },

  /**
   * @param options is optional
   */
  'delete': function(path, options, callback) {
    // XXX TODO implementation
  },

  getIds: function() {
    var ids = libutils.toArray(arguments)
      , get_path = ids.shift()
      , callback = ids.pop();
    if (libutils.isEmpty(ids)) {
      return this.get(get_path, callback);
    }
    // XXX TODO implementation
  }

});

exports.connection = connection;
exports.DM_BASE = DM_BASE;
