var Connection, Query, top_level, _;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

_ = require('underscore');

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
  expires_at: true
};

/*
* Query for tasks
* Rich query mechanism
*/

Query = (function() {

  __extends(Query, Connection);

  function Query() {
    this.get_path = 'tasks.json';
    this.constraints = [];
    this.ordering = false;
    this.limited = false;
  }

  Query.prototype.eq = function(prop, value) {
    return this.constraints.push({
      op: 'eq',
      prop: prop,
      value: value
    });
  };

  Query.prototype.where = Query.prototype.eq;

  Query.prototype.ne = function(prop, value) {
    return this.constraints.push({
      op: 'ne',
      prop: prop,
      value: value
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

  Query.prototype.order_by = function(o) {
    return this.ordering = o;
  };

  Query.prototype.apply_ordering = function(tasks) {
    if (this.ordering === '?') {
      return _.shuffle(tasks);
    } else {
      return _.sortBy(tasks, function(task) {
        if (this.ordering in top_level) {
          return task[this.ordering];
        } else {
          return task.parameters[this.ordering];
        }
      }, this);
    }
  };

  Query.prototype.limit = function(l) {
    return this.limited = l;
  };

  Query.prototype.run = function(callback) {
    var _this = this;
    return Query.get(this.get_path, function(r) {
      var tasks;
      tasks = r.map(function(t) {
        return t.task;
      });
      tasks = tasks.filter(_this.check_constraints, _this);
      if (_this.ordering) tasks = _this.apply_ordering(tasks);
      if (_this.limited) tasks = tasks.slice(0, _this.limited);
      return callback(tasks);
    });
  };

  return Query;

})();

exports.Query = Query;
