(function() {
  var Connection, DM_URL, Dormouse, Projects, Tasks, async, implements, namespace, path, root;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref2;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? global : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref2 = name.split('.');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      item = _ref2[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };
  implements = function() {
    var classes, getter, klass, prop, setter, _i, _len;
    classes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = classes.length; _i < _len; _i++) {
      klass = classes[_i];
      for (prop in klass) {
        this[prop] = klass[prop];
      }
      for (prop in klass.prototype) {
        getter = klass.prototype.__lookupGetter__(prop);
        setter = klass.prototype.__lookupSetter__(prop);
        if (getter || setter) {
          if (getter) {
            this.prototype.__defineGetter__(prop, getter);
          }
          if (setter) {
            this.prototype.__defineSetter__(prop, setter);
          }
        } else {
          this.prototype[prop] = klass.prototype[prop];
        }
      }
    }
    return this;
  };
  if (Object.defineProperty) {
    Object.defineProperty(Function.prototype, "implements", {
      value: implements
    });
  } else {
    Function.prototype.implements = implements;
  }
  /*
  utils for simplify detecting types and stuff
  */
  namespace('libutils', function(exports, global) {
    exports.isEmpty = function(obj) {
      var prop;
      for (prop in obj) {
        if (!__hasProp.call(obj, prop)) continue;
        return false;
      }
      return true;
    };
    exports.isArray = function(obj) {
      return obj instanceof Array;
    };
    return exports.toArray = function(array_like) {
      return Array.prototype.slice.call(array_like);
    };
  });
  path = require('path');
  async = require('async');
  DM_URL = 'http://arya.stanford.edu:3777/';
  /*
  Base Connection
  */
  Connection = (function() {
    function Connection() {}
    /*
      Assumption that it is getting JSON
      @param options serialized in GET params
      */
    Connection.prototype.get = function(get_path, options, callback) {
      var request;
      get_path = path.join(DM_URL, get_path);
      request = new XMLHttpRequest;
      request.open('GET', get_path, true);
      request.onreadystatechange = function(e) {
        if (request.readyState === 4) {
          console.log(request.responseText);
          return callback(JSON.parse(request.responseText));
        } else {
          console.log('Error', request.statusText);
          return callback(request.statusText);
        }
      };
      return request.send(null);
    };
    /*
      @param options appended to URL
      @param body dumped in POST body
      */
    Connection.prototype.post = function(post_path, options, body, callback) {};
    /*
      @param options appended to URL
      @param body dumped in body
      */
    Connection.prototype.put = function(put_path, options, body, callback) {};
    /*
      @param options is optional
      */
    Connection.prototype["delete"] = function(delete_path, options, callback) {};
    Connection.prototype.getIds = function() {
      var callback, get_path, ids, items;
      ids = libutils.toArray(arguments);
      get_path = ids.shift();
      callback = ids.pop();
      if (libutils.isEmpty(ids)) {
        return this.get(get_path, callback);
      } else {
        items = [];
        return async.forEach(ids, function(id, done) {
          var id_path;
          id_path = path.join(get_path, "" + id + ".json");
          return this.get(id_path, function(item) {
            items.push(item);
            return done();
          });
        }, function(err) {
          if (err) {
            return callback(false);
          } else {
            return callback(items);
          }
        });
      }
    };
    return Connection;
  })();
  /*
  
  Task structure on API
  
  {
    id: '1234',
    question: 'What is the speed of a European swallow-tailed swift?'
  }
  
  */
  path = require('path');
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
      args = [get_path].concat(arguments);
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
  /*
  
  Project structure on API
  
  {
    id: '1234',
    template: '2561'
  }
  
  */
  path = require('path');
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
    Projects.prototype.getProjects = function(ids, callback) {
      var args, get_path;
      get_path = 'projects.json';
      args = [get_path].concat(arguments);
      return this.getIds.apply(this, args);
    };
    Projects.prototype.createProject = function(project_info, callback) {
      var post_path;
      post_path = 'projects.json';
      return this.post(post_path, project_info, callback);
    };
    Projects.prototype.editProject = function(project, callback) {
      var put_path;
      put_path = path.join('projects', "" + project.id + ".json");
      return this.put(put_path, project, callback);
    };
    Projects.prototype.deleteProject = function(project, callback) {
      var delete_path;
      delete_path = path.join('projects', "" + project.id + ".json");
      return this['delete'](delete_path, callback);
    };
    return Projects;
  })();
  /*
  Top level Dormouse
  */
  Dormouse = (function() {
    function Dormouse() {}
    Dormouse.implements(Tasks, Projects);
    return Dormouse;
  })();
  root = this;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dormouse;
  } else {
    root.$dm = Dormouse;
  }
}).call(this);
