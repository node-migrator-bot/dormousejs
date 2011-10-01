
var path = require('path')
  , libutils = require('./lib/utils')
  , connection = require('./lib/base').connection
  , DM_BASE = require('./lib/base').DM_BASE;

/******************\
Task structure on API

{
  id: '1234',
  question: 'What is the speed of a European swallow-tailed swift?'
}

\******************/

/**
 * Tasks mixin for $dm
 * basic API operations
 */
var tasks = Class.create(connection, {

  /**
   * ids = ids of tasks to fetch, optional
   */
  getTasks: function(ids, callback) {
    var get_path = path.join(DM_BASE, 'tasks.json')
      , args = [ get_path ].concat(arguments);
    return this.getIds.apply(this, args);
  },

  createTask: function(task_info, callback) {
    var post_path = path.join(DM_BASE, 'tasks.json');
    return this.post(post_path, task_info, callback);
  },

  performTask: function(task, callback) {
    var get_path = path.join(DM_BASE, 'tasks', task.id, 'perform.json');
    return this.get(get_path, callback);
  },

  answerTask: function(task, answer_info, callback) {
    var put_path = path.join(DM_BASE, 'tasks', task.id, 'answer.json');
    return this.put(put_path, answer_info, callback);
  },

  deleteTask: function(task, callback) {
    var delete_path = path.join(DM_BASE, 'tasks', task.id + '.json');
    return this['delete'](delete_path, callback);
  }

});

exports.tasks = tasks;
