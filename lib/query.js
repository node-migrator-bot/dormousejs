var Connection, Query;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Connection = require('./connection').Connection;

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
      tasks = r.map(function(t) {
        var task;
        task = t.task;
        return this.constraints.every(function(c) {
          return task[c.prop] === c.value;
        });
      });
      console.assert(this.limit, 'context not set properly from Connection');
      return callback(tasks.slice(0, this.limit));
    });
  };

  return Query;

})();
