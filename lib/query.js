var Connection, Query, top_level;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
    this.l = false;
  }

  Query.prototype.where = function(prop, value) {
    return this.constraints.push({
      prop: prop,
      value: value
    });
  };

  Query.prototype.limit = function(l) {
    return this.l = l;
  };

  Query.prototype.run = function(callback) {
    var _this = this;
    return Query.get(this.get_path, function(r) {
      var tasks;
      tasks = r.map(function(t) {
        return t.task;
      });
      tasks = tasks.filter(function(task) {
        return this.constraints.every(function(c) {
          if (c.prop in top_level) {
            return task[c.prop] === c.value;
          } else {
            return task.parameters[c.prop] === c.value;
          }
        });
      }, _this);
      if (_this.l) tasks = tasks.slice(0, _this.l);
      return callback(tasks);
    });
  };

  return Query;

})();

exports.Query = Query;
