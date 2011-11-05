/*

Task structure on API

{
  id: '1234',
  question: 'What is the speed of a European swallow-tailed swift?'
}

*/
var Connection, Tasks, path;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
path = require('path');
Connection = require('./connection').Connection;
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
    @param ids = ids of tasks to fetch, optional
    */
  Tasks.prototype.getTasks = function(ids, callback) {
    var args, get_path;
    get_path = 'tasks.json';
    args = Array.prototype.concat.apply([get_path], arguments);
    return this.getIds.apply(this, args);
  };
  Tasks.prototype.createTask = function(task_info, callback) {
    var post_path;
    post_path = 'tasks.json';
    return this.post(post_path, task_info, callback);
  };
  Tasks.prototype.performTask = function(task, callback) {
    var get_path;
    get_path = path.join('tasks', task.id, 'perform.json');
    return this.get(get_path, callback);
  };
  Tasks.prototype.answerTask = function(task, answer_info, callback) {
    var put_path;
    put_path = path.join('tasks', task.id, 'answer.json');
    return this.put(put_path, answer_info, callback);
  };
  Tasks.prototype.deleteTask = function(task, callback) {
    var delete_path;
    delete_path = path.join('tasks', "" + task.id + ".json");
    return this["delete"](delete_path, callback);
  };
  return Tasks;
})();
exports.Tasks = Tasks;