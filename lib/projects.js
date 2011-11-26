
/*

Project structure on API

{
  id: '1234',
  template: '2561'
}
*/

var Connection, Projects, path;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

path = require('path');

Connection = require('./connection').Connection;

/*
* Projects mixin for Dormouse
* basic API operations
*/

Projects = (function() {

  __extends(Projects, Connection);

  function Projects() {
    Projects.__super__.constructor.apply(this, arguments);
  }

  /*
    @param ids = ids of projects to fetch, optional
  */

  Projects.getProjects = function(ids, callback) {
    var args, get_path;
    get_path = 'projects.json';
    args = Array.prototype.concat.apply([get_path], arguments);
    return this.getIds.apply(this, args);
  };

  Projects.createProject = function(project_info, callback) {
    var post_path;
    post_path = 'projects.json';
    return this.post(post_path, {}, project_info, callback);
  };

  Projects.editProject = function(project, callback) {
    var put_path;
    put_path = path.join('projects', "" + project.id + ".json");
    return this.put(put_path, {}, project, callback);
  };

  Projects.deleteProject = function(project, callback) {
    var delete_path;
    delete_path = path.join('projects', "" + project.id + ".json");
    return this["delete"](delete_path, callback);
  };

  return Projects;

})();

exports.Projects = Projects;
