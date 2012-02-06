var Connection, Store, handleResponse, http, libutils, parseResponse, path, signRequest, successful_statuses, _,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

path = require('path');

_ = require('underscore');

http = require('http-browserify');

Store = require('./store').Store;

libutils = require('./libutils');

Connection = (function() {

  function Connection() {}

  Connection.get = function(get_path, options, callback) {
    var req;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    get_path = libutils.formatUrl({
      path: get_path,
      query: signRequest(options)
    });
    req = http.request({
      method: 'GET',
      host: Store.host(),
      port: Store.port(),
      path: get_path
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end();
  };

  Connection.post = function(post_path, options, body, callback) {
    var raw_body, raw_length, req;
    post_path = libutils.formatUrl({
      path: post_path,
      query: signRequest(options)
    });
    raw_body = JSON.stringify(body);
    raw_length = typeof Buffer !== "undefined" && Buffer !== null ? Buffer.byteLength(raw_body) : raw_body.length;
    req = http.request({
      method: 'POST',
      host: Store.host(),
      port: Store.port(),
      path: post_path,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': raw_length
      }
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end(raw_body);
  };

  Connection.put = function(put_path, options, body, callback) {
    var raw_body, raw_length, req;
    put_path = libutils.formatUrl({
      path: put_path,
      query: signRequest(options)
    });
    raw_body = JSON.stringify(body);
    raw_length = typeof Buffer !== "undefined" && Buffer !== null ? Buffer.byteLength(raw_body) : raw_body.length;
    req = http.request({
      method: 'PUT',
      host: Store.host(),
      port: Store.port(),
      path: put_path,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': raw_length
      }
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end(raw_body);
  };

  Connection["delete"] = function(delete_path, options, callback) {
    var req;
    delete_path = libutils.formatUrl({
      path: delete_path,
      query: signRequest(options)
    });
    req = http.request({
      method: 'DELETE',
      host: Store.host(),
      port: Store.port(),
      path: delete_path
    }, function(res) {
      return handleResponse(res, callback);
    });
    return req.end();
  };

  return Connection;

})();

signRequest = function(options) {
  if ('access_token' in options || 'api_key' in options) {
    return options;
  } else if (Store.access_token()) {
    return _.extend(options, {
      access_token: Store.access_token()
    });
  } else {
    return _.extend(options, {
      api_key: Store.api_key()
    });
  }
};

handleResponse = function(res, callback) {
  var data;
  data = '';
  res.on('data', function(buf) {
    return data += buf;
  });
  res.on('end', function() {
    if (callback) return parseResponse(res, data, callback);
  });
  return res.on('error', function(err) {
    return console.log('HTTP error', res.statusCode, data, err);
  });
};

successful_statuses = [200, 201, 202];

parseResponse = function(res, raw_response, callback) {
  var response, _ref;
  raw_response = raw_response.trim();
  if (_ref = res.statusCode, __indexOf.call(successful_statuses, _ref) >= 0) {
    if (raw_response) {
      try {
        response = JSON.parse(raw_response);
      } catch (err) {
        if (console) console.error('Response JSON parsing error', err);
      }
      return callback(null, response);
    } else {
      return callback(null, {
        success: true
      });
    }
  } else {
    if (console) console.info('Request failed', raw_response);
    return callback(new Error(raw_response), null);
  }
};

exports.Connection = Connection;
