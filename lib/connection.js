var Connection, appendAPIKey, async, handleResponse, http, libutils, parseResponse, path, _;

path = require('path');

async = require('async');

_ = require('underscore');

http = require('http-browserify');

libutils = require('./libutils');

/*
Base Connection
*/

Connection = (function() {
  var api_key, host, port;

  function Connection() {}

  /*
    Assumption that it is getting JSON
    @param options serialized in GET params
  */

  Connection.get = function(get_path, options, callback) {
    var req;
    get_path = libutils.formatUrl({
      path: get_path,
      query: appendAPIKey(options)
    });
    req = http.request({
      method: 'GET',
      host: Connection.host(),
      port: Connection.port(),
      path: get_path
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end();
  };

  /*
    @param options appended to URL
    @param body dumped in POST body
  */

  Connection.post = function(post_path, options, body, callback) {
    var req;
    post_path = libutils.formatUrl({
      path: post_path,
      query: appendAPIKey(options)
    });
    req = http.request({
      method: 'POST',
      host: Connection.host(),
      port: Connection.port(),
      path: post_path,
      headers: {
        'Content-Type': 'application/json'
      }
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end(JSON.stringify(body));
  };

  /*
    @param options appended to URL
    @param body dumped in body
  */

  Connection.put = function(put_path, options, body, callback) {
    var req;
    put_path = libutils.formatUrl({
      path: put_path,
      query: appendAPIKey(options)
    });
    req = http.request({
      method: 'PUT',
      host: Connection.host(),
      port: Connection.port(),
      path: put_path,
      headers: {
        'Content-Type': 'application/json'
      }
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end(JSON.stringify(body));
  };

  /*
    @param options is optional
  */

  Connection["delete"] = function(delete_path, options, callback) {
    var req;
    delete_path = libutils.formatUrl({
      path: delete_path,
      query: appendAPIKey(options)
    });
    req = http.request({
      method: 'DELETE',
      host: Connection.host(),
      port: Connection.port(),
      path: delete_path
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end();
  };

  Connection.getIds = function() {
    var callback, get_path, ids, items;
    ids = libutils.toArray(arguments);
    get_path = ids.shift();
    callback = ids.pop();
    if (libutils.isEmpty(ids)) {
      return this.get(get_path, {}, callback);
    } else {
      items = [];
      return async.forEach(ids, function(id, done) {
        var id_path;
        id_path = path.join(get_path, "" + id + ".json");
        return this.get(id_path, {}, function(item) {
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

  host = 'dormou.se';

  port = 80;

  Connection.server = function(setter) {
    var matched;
    if (setter) {
      matched = setter.match(/^((https?):\/\/)?([A-Za-z0-9\.]+)(:(\d+))?\/?$/);
      if (matched) {
        host = matched[3] || 'dormou.se';
        port = matched[5] || 80;
      } else {
        throw new Error('Improperly formatted url passed to Dormouse.server(...)');
      }
    }
    return "http://" + host + ":" + port + "/";
  };

  Connection.host = function(setter) {
    if (setter) host = setter;
    return host;
  };

  Connection.port = function(setter) {
    if (setter) port = setter;
    return port;
  };

  api_key = '';

  Connection.api_key = function(setter) {
    if (setter) api_key = setter;
    if (!api_key) {
      throw new Error('You cannot make API calls without an api_key. Set it using Dormouse.api_key(...)');
    }
    return api_key;
  };

  return Connection;

})();

appendAPIKey = function(options) {
  return _.extend(options, {
    api_key: Connection.api_key()
  });
};

handleResponse = function(res, callback) {
  var data;
  data = '';
  res.on('data', function(buf) {
    return data += buf;
  });
  res.on('end', function() {
    if (callback) return callback(parseResponse(data));
  });
  return res.on('error', function(err) {
    return console.log('HTTP error', res.statusCode, data, err);
  });
};

parseResponse = function(raw_response) {
  try {
    return JSON.parse(raw_response);
  } catch (syntax_error) {
    console.log('Response JSON parsing error:', syntax_error);
  }
  return raw_response;
};

exports.Connection = Connection;
