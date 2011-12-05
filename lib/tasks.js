
/*

Task structure on API

{
  id: 1234,
  name: "ManReduce-Step-1",
* project_id: 11,
* template_id: 7,
* duplication: 1,
* replication: 1,
  created_at: "2011-10-14T14:02:47Z",
  updated_at: "2011-10-14T14:02:47Z",
  expires_at: "",
* eligibility: {
    communities: [],
    predicate: null
  },
* parameters: {
    question: "blah"
  }
}
*/

var Connection, Query, Tasks, path, _;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

path = require('path');

Connection = require('./connection').Connection;

Query = require('./query').Query;

_ = require('underscore');

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

/*
* Tasks mixin for Dormouse
* basic API operations
*/

Tasks = (function() {

  __extends(Tasks, Connection);

  function Tasks() {
    Tasks.__super__.constructor.apply(this, arguments);
  }

  /*
    Fetch a task from Dormouse
    @param id of task
  */

  Tasks.getTask = function(id, callback) {
    return this.get("tasks/" + id + ".json", function(r) {
      return callback(r.task);
    });
  };

  /*
    Fetches all tasks from Dormouse
  */

  Tasks.getTasks = function(callback) {
    var q;
    q = new Query();
    if (callback && typeof callback === 'function') q.run(callback);
    return q;
  };

  Tasks.render = function(snippet, task) {
    var context, template;
    template = _.template(snippet);
    context = {};
    _.extend(context, task.parameters);
    return template(context);
  };

  /*
    @param task_info = object with the following required fields
        project_id. template_id, parameters
      and the following optional fields
        expires_at, name, eligibility, replication, duplication
    @callback { status: 'created', location: 1234 }
  */

  Tasks.createTask = function(task_info, callback) {
    var field, post_path, required_fields, _i, _len, _ref, _ref2, _ref3;
    required_fields = ['project_id', 'template_id', 'parameters'];
    for (_i = 0, _len = required_fields.length; _i < _len; _i++) {
      field = required_fields[_i];
      if (!(field in task_info)) {
        throw new Error("Required field for task creation: " + field);
      }
    }
    if ((_ref = task_info.eligibility) == null) {
      task_info.eligibility = {
        predicate: null,
        communities: []
      };
    }
    if ((_ref2 = task_info.replication) == null) task_info.replication = 1;
    if ((_ref3 = task_info.duplication) == null) task_info.duplication = 1;
    post_path = 'tasks.json';
    return this.post(post_path, {}, {
      'task': task_info
    }, callback);
  };

  Tasks.performTask = function(task, callback) {
    var get_path;
    get_path = path.join('tasks', task.id, 'perform.json');
    return this.get(get_path, callback);
  };

  Tasks.answerTask = function(task, answer_info, callback) {
    var put_path;
    put_path = path.join('tasks', task.id, 'answer.json');
    return this.put(put_path, {}, answer_info, callback);
  };

  Tasks.deleteTask = function(task, callback) {
    var delete_path;
    delete_path = path.join('tasks', "" + task.id + ".json");
    return this["delete"](delete_path, callback);
  };

  return Tasks;

})();

exports.Tasks = Tasks;
