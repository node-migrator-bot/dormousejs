/*
utils for simplify detecting types and stuff
*/
var libutils, _;
var __hasProp = Object.prototype.hasOwnProperty;
_ = require('underscore');
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
/*
format of urlObj:
{
  path: '/some/relative/path' [no host]
  query: javascript object to append as params
}
*/
libutils.formatUrl = function(urlObj) {
  var eq, pairs, qs, query, sep, url;
  query = urlObj.query || {};
  sep = '&';
  eq = '=';
  pairs = _.map(query, function(value, key) {
    return encodeURIComponent(key) + eq + encodeURIComponent(value);
  });
  qs = pairs.join(sep);
  url = urlObj.path || '/';
  if (url.match(/#/)) {
    url = url.substr(0, url.indexOf('#'));
  }
  if (qs.length > 0) {
    if (url.match(/\?/)) {
      url += sep + qs;
    } else {
      url += '?' + qs;
    }
  }
  if (!url.match(/^\//)) {
    url = '/' + url;
  }
  return url;
};