
var path = require('path')
  , libutils = require('./lib/utils')
  , connection = require('./lib/base').connection
  , DM_BASE = require('./lib/base').DM_BASE;

var tasks = Class.create(connection, {
  getTasks: function() {
    var get_path = path.join(DM_BASE, 'tasks')
      , args = [ get_path ].concat(arguments);
    return this.getIds.apply(this, args);
  }
});

exports.tasks = tasks;
