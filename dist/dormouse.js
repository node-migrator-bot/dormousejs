var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}
var __require = require;

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require.resolve = (function () {
    var core = {
        'assert': true,
        'events': true,
        'fs': true,
        'path': true,
        'vm': true
    };
    
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (core[x]) return x;
        var path = require.modules.path();
        var y = cwd || '.';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = x + '/package.json';
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = Object_keys(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = function (fn) {
    setTimeout(fn, 0);
};

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

require.modules["path"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "path";
    
    var require = function (file) {
        return __require(file, ".");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, ".");
    };
    
    require.modules = __require.modules;
    __require.modules["path"]._cached = module.exports;
    
    (function () {
        function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};
;
    }).call(module.exports);
    
    __require.modules["path"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/package.json"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse";
    var __filename = "/node_modules/dormouse/package.json";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/package.json"]._cached = module.exports;
    
    (function () {
        module.exports = {"name":"dormouse","version":"0.0.1","description":"Javascript API for Dormouse","main":"lib/assembler","homepage":"http://dormou.se","keywords":["crowdsourcing"],"repository":{"type":"git","url":"http://github.com/zahanm/node-dormouse.git"},"dependencies":{"underscore":"*","async":"*"},"devDependencies":{"coffee-script":"*","browserify":"*"}};
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/package.json"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/lib/assembler.coffee"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/lib";
    var __filename = "/node_modules/dormouse/lib/assembler.coffee";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/lib/assembler.coffee"]._cached = module.exports;
    
    (function () {
        (function() {
  var Connection, Dormouse, Projects, Tasks;
  require('./mixin');
  Connection = require('./connection').Connection;
  Tasks = require('./tasks').Tasks;
  Projects = require('./projects').Projects;
  /*
  Top level Dormouse
  */
  Dormouse = (function() {
    function Dormouse() {}
    Dormouse.implements(Tasks, Projects);
    return Dormouse;
  })();
  exports.Dormouse = Dormouse;
}).call(this);
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/lib/assembler.coffee"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/lib/mixin.coffee"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/lib";
    var __filename = "/node_modules/dormouse/lib/mixin.coffee";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/lib/mixin.coffee"]._cached = module.exports;
    
    (function () {
        (function() {
  var implements;
  var __slice = Array.prototype.slice;
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
}).call(this);
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/lib/mixin.coffee"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/lib/connection.coffee"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/lib";
    var __filename = "/node_modules/dormouse/lib/connection.coffee";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/lib/connection.coffee"]._cached = module.exports;
    
    (function () {
        (function() {
  var Connection, DM_URL, async, libutils, path;
  path = require('path');
  async = require('async');
  libutils = require('./libutils');
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
          if (request.status === 200) {
            console.log(request.responseText);
            if (callback) {
              return callback(JSON.parse(request.responseText));
            }
          } else {
            console.log('Error', request.statusText);
            if (callback) {
              return callback(request.statusText);
            }
          }
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
  exports.Connection = Connection;
}).call(this);
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/lib/connection.coffee"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/node_modules/async/package.json"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/node_modules/async";
    var __filename = "/node_modules/dormouse/node_modules/async/package.json";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/node_modules/async");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/node_modules/async");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/node_modules/async/package.json"]._cached = module.exports;
    
    (function () {
        module.exports = {"name":"async","description":"Higher-order functions and common patterns for asynchronous code","main":"./index","author":"Caolan McMahon","version":"0.1.10","repository":{"type":"git","url":"http://github.com/caolan/async.git"},"bugs":{"web":"http://github.com/caolan/async/issues"},"licenses":[{"type":"MIT","url":"http://github.com/caolan/async/raw/master/LICENSE"}]};
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/node_modules/async/package.json"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/node_modules/async/index.js"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/node_modules/async";
    var __filename = "/node_modules/dormouse/node_modules/async/index.js";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/node_modules/async");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/node_modules/async");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/node_modules/async/index.js"]._cached = module.exports;
    
    (function () {
        // This file is just added for convenience so this repository can be
// directly checked out into a project's deps folder
module.exports = require('./lib/async');
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/node_modules/async/index.js"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/node_modules/async/lib/async.js"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/node_modules/async/lib";
    var __filename = "/node_modules/dormouse/node_modules/async/lib/async.js";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/node_modules/async/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/node_modules/async/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/node_modules/async/lib/async.js"]._cached = module.exports;
    
    (function () {
        /*global setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root = this,
        previous_async = root.async;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    else {
        root.async = async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    //// cross-browser compatiblity functions ////

    var _forEach = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _forEach(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _forEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    var _indexOf = function (arr, item) {
        if (arr.indexOf) {
            return arr.indexOf(item);
        }
        for (var i = 0; i < arr.length; i += 1) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        async.nextTick = function (fn) {
            setTimeout(fn, 0);
        };
    }
    else {
        async.nextTick = process.nextTick;
    }

    async.forEach = function (arr, iterator, callback) {
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _forEach(arr, function (x) {
            iterator(x, function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback();
                    }
                }
            });
        });
    };

    async.forEachSeries = function (arr, iterator, callback) {
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    
    async.forEachLimit = function (arr, limit, iterator, callback) {
        if (!arr.length || limit <= 0) {
            return callback(); 
        }
        var completed = 0;
        var started = 0;
        var running = 0;
        
        (function replenish () {
          if (completed === arr.length) {
              return callback();
          }
          
          while (running < limit && started < arr.length) {
            iterator(arr[started], function (err) {
              if (err) {
                  callback(err);
                  callback = function () {};
              }
              else {
                  completed += 1;
                  running -= 1;
                  if (completed === arr.length) {
                      callback();
                  }
                  else {
                      replenish();
                  }
              }
            });
            started += 1;
            running += 1;
          }
        })();
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEach].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);


    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.forEachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.forEach(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.forEach(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var completed = [];

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _forEach(listeners, function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (completed.length === keys.length) {
                callback(null);
            }
        });

        _forEach(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                if (err) {
                    callback(err);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    completed.push(k);
                    taskComplete();
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && _indexOf(completed, x) !== -1);
                }, true);
            };
            if (ready()) {
                task[task.length - 1](taskCallback);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        if (!tasks.length) {
            return callback();
        }
        callback = callback || function () {};
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.nextTick(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    async.parallel = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.forEach(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.forEachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.queue = function (worker, concurrency) {
        var workers = 0;
        var tasks = [];
        var q = {
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                tasks.push({data: data, callback: callback});
                if(q.saturated && tasks.length == concurrency) q.saturated();
                async.nextTick(q.process);
            },
            process: function () {
                if (workers < q.concurrency && tasks.length) {
                    var task = tasks.shift();
                    if(q.empty && tasks.length == 0) q.empty();
                    workers += 1;
                    worker(task.data, function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if(q.drain && tasks.length + workers == 0) q.drain();
                        q.process();
                    });
                }
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _forEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        hasher = hasher || function (x) {
            return x;
        };
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else {
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    callback.apply(null, arguments);
                }]));
            }
        };
    };

}());
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/node_modules/async/lib/async.js"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/lib/libutils.coffee"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/lib";
    var __filename = "/node_modules/dormouse/lib/libutils.coffee";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/lib/libutils.coffee"]._cached = module.exports;
    
    (function () {
        (function() {
  /*
  utils for simplify detecting types and stuff
  */
  var libutils;
  var __hasProp = Object.prototype.hasOwnProperty;
  libutils = exports;
  libutils.isEmpty = function(obj) {
    var prop;
    for (prop in obj) {
      if (!__hasProp.call(obj, prop)) continue;
      return false;
    }
    return true;
  };
  libutils.isArray = function(obj) {
    return obj instanceof Array;
  };
  libutils.toArray = function(array_like) {
    return Array.prototype.slice.call(array_like);
  };
}).call(this);
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/lib/libutils.coffee"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/lib/tasks.coffee"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/lib";
    var __filename = "/node_modules/dormouse/lib/tasks.coffee";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/lib/tasks.coffee"]._cached = module.exports;
    
    (function () {
        (function() {
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
  exports.Tasks = Tasks;
}).call(this);
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/lib/tasks.coffee"]._cached = module.exports;
    return module.exports;
};

require.modules["/node_modules/dormouse/lib/projects.coffee"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/node_modules/dormouse/lib";
    var __filename = "/node_modules/dormouse/lib/projects.coffee";
    
    var require = function (file) {
        return __require(file, "/node_modules/dormouse/lib");
    };
    
    require.resolve = function (file) {
        return __require.resolve(name, "/node_modules/dormouse/lib");
    };
    
    require.modules = __require.modules;
    __require.modules["/node_modules/dormouse/lib/projects.coffee"]._cached = module.exports;
    
    (function () {
        (function() {
  /*
  
  Project structure on API
  
  {
    id: '1234',
    template: '2561'
  }
  
  */
  var Connection, Projects, path;
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
      return this["delete"](delete_path, callback);
    };
    return Projects;
  })();
  exports.Projects = Projects;
}).call(this);
;
    }).call(module.exports);
    
    __require.modules["/node_modules/dormouse/lib/projects.coffee"]._cached = module.exports;
    return module.exports;
};

(function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "/";
    var __filename = "//Users/zahanm/Documents/Research/dormousejs/dist";
    
    var require = function (file) {
        return __require(file, "/");
    };
    require.modules = __require.modules;
    
    
// window in browser, global on server
var root = this;
var Dormouse = require('dormouse').Dormouse;
root.$dm = new Dormouse();

;
})();

