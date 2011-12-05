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
    this.contraints = [];
    this.limit = false;
  }

  Query.prototype.where = function(prop, value) {
    return this.contraints.append({
      prop: value
    });
  };

  Query.prototype.limit = function(l) {
    return this.limit = l;
  };

  Query.prototype.run = function(callback) {
    return this.get(this.get_path, function(r) {
      var tasks;
      var _this = this;
      tasks = r.map(function(t) {
        return t.task;
      });
      tasks = tasks.filter(function(task) {
        return _this.constraints.every(function(c) {
          if (c.prop in top_level) {
            return task[c.prop] === c.value;
          } else {
            return task.parameters[c.prop] === c.value;
          }
        });
      });
      console.assert(this.limit !== void 0, 'context not set properly from Connection');
      if (this.limit != null) tasks = tasks.slice(0, this.limit);
      return callback(tasks);
    });
  };

  return Query;

})();

exports.Query = Query;
