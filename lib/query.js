var Connection, Query, Store, top_level, _,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Store = require('./store').Store;

Connection = require('./connection').Connection;

top_level = {
  id: true,
  name: true,
  project_id: true,
  template_id: true,
  duplication: true,
  replication: true,
  created_at: true,
  updated_at: true,
  expires_at: true,
  responses: true
};

Query = (function(_super) {

  __extends(Query, _super);

  function Query() {
    var project_id;
    project_id = Store.project_id();
    this.get_path = "/api/v1/projects/" + project_id + "/tasks.json";
    this.constraints = [];
    this.ordering = false;
    this.limited = false;
    this.options = {};
  }

  Query.prototype.eq = function(prop, value) {
    this.constraints.push({
      op: 'eq',
      prop: prop,
      value: value
    });
    return this;
  };

  Query.prototype.where = Query.prototype.eq;

  Query.prototype.ne = function(prop, value) {
    this.constraints.push({
      op: 'ne',
      prop: prop,
      value: value
    });
    return this;
  };

  Query.prototype.iscomplete = function(value) {
    if (!value) this.get_path = this.get_path.replace(/\.json$/, '/open.json');
    return this;
  };

  Query.prototype.order_by = function(o) {
    this.ordering = o;
    return this;
  };

  Query.prototype.limit = function(l) {
    this.limited = l;
    return this;
  };

  Query.prototype.authenticate = function(token) {
    this.options['access_token'] = token;
    return this;
  };

  Query.prototype.run = function(callback) {
    var _this = this;
    return Query.get(this.get_path, this.options, function(err, r) {
      var tasks;
      if (err) return callback(err, r);
      tasks = r.map(function(t) {
        return t.task;
      });
      tasks = tasks.filter(_this.check_constraints, _this);
      if (_this.ordering) tasks = _this.apply_ordering(tasks);
      if (_this.limited) tasks = tasks.slice(0, _this.limited);
      if (tasks.length) {
        return callback(null, tasks);
      } else {
        return callback('No tasks matching constraints', null);
      }
    });
  };

  Query.prototype.check_constraints = function(task) {
    return this.constraints.every(function(c) {
      var task_value;
      if (c.prop in top_level) {
        task_value = task[c.prop];
      } else {
        task_value = task.parameters[c.prop];
      }
      switch (c.op) {
        case 'ne':
          return task_value !== c.value;
        default:
          return task_value === c.value;
      }
    });
  };

  Query.prototype.apply_ordering = function(tasks) {
    var top_level_prop;
    if (this.ordering === '?') {
      return _.shuffle(tasks);
    } else {
      top_level_prop = this.ordering in top_level;
      return _.sortBy(tasks, function(task) {
        if (top_level_prop) {
          return task[this.ordering];
        } else {
          return task.parameters[this.ordering];
        }
      }, this);
    }
  };

  return Query;

})(Connection);

exports.Query = Query;
