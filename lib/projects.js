var Connection, Projects, Store, path,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

path = require('path');

Store = require('./store').Store;

Connection = require('./connection').Connection;

Projects = (function(_super) {

  __extends(Projects, _super);

  function Projects() {
    Projects.__super__.constructor.apply(this, arguments);
  }

  Projects.getProject = function(callback) {
    var project_id;
    project_id = Store.project_id();
    return this.getProjectFromID(project_id, callback);
  };

  Projects.getProjectFromID = function(id, callback) {
    return this.get("/api/v1/projects/" + id + ".json", function(err, r) {
      if (err) {
        return callback(err, r);
      } else {
        return callback(null, r.project);
      }
    });
  };

  Projects.editProject = function(project, callback) {
    var put_path;
    put_path = "/api/v1/projects/" + project.id + ".json";
    return this.put(put_path, {}, project, callback);
  };

  Projects.deleteProject = function(project, callback) {
    var delete_path;
    delete_path = "/api/v1/projects/" + project.id + ".json";
    return this["delete"](delete_path, callback);
  };

  return Projects;

})(Connection);

exports.Projects = Projects;
