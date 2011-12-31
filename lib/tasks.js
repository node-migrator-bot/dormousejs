var Connection, Query, Tasks, _,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Connection = require('./connection').Connection;

Query = require('./query').Query;

_ = require('underscore');

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

Tasks = (function(_super) {

  __extends(Tasks, _super);

  function Tasks() {
    Tasks.__super__.constructor.apply(this, arguments);
  }

  Tasks.getTask = function(id, callback) {
    return this.get("tasks/" + id + ".json", function(err, r) {
      if (err) {
        return callback(err, r);
      } else {
        return callback(null, r.task);
      }
    });
  };

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
    ['id', 'name', 'project_id', 'template_id'].forEach(function(prop) {
      return context[prop] = task[prop];
    });
    return template(context);
  };

  Tasks.createTask = function(task_info, callback) {
    var field, post_path, required_fields, _i, _len;
    required_fields = ['project_id', 'template_id', 'parameters'];
    for (_i = 0, _len = required_fields.length; _i < _len; _i++) {
      field = required_fields[_i];
      if (!(field in task_info)) {
        throw new Error("Required field for task creation: " + field);
      }
    }
    if (task_info.eligibility == null) {
      task_info.eligibility = {
        predicate: null,
        communities: []
      };
    }
    if (task_info.replication == null) task_info.replication = 1;
    if (task_info.duplication == null) task_info.duplication = 1;
    post_path = 'tasks.json';
    return this.post(post_path, {}, {
      'task': task_info
    }, callback);
  };

  Tasks.answerTask = function(task_id, answer_info, callback) {
    var put_path;
    put_path = "tasks/" + task_id + "/answer.json";
    return this.put(put_path, {}, answer_info, callback);
  };

  Tasks.deleteTask = function(task_id, callback) {
    var delete_path;
    delete_path = "tasks/" + task_id + ".json";
    return this["delete"](delete_path, callback);
  };

  return Tasks;

})(Connection);

exports.Tasks = Tasks;
