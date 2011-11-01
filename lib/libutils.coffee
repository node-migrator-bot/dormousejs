
###
utils for simplify detecting types and stuff
###

_ = require 'underscore'

libutils = exports

libutils.isEmpty = (obj) ->
  for own prop of obj
    return false
  return true

libutils.isArray = (obj) ->
  return obj instanceof Array

libutils.toArray = (array_like) ->
  return Array.prototype.slice.call array_like

###
format of urlObj:
{
  host: 'http://yoursite.com:3434/'
  path: '/some/absolute/or/relative/url' [required]
  query: javascript object to append as params
}
###
libutils.formatUrl = (urlObj) ->
  query = urlObj.query || {}
  sep = '&'
  eq = '='
  pairs = _.map query, (value, key) ->
    return encodeURIComponent(key) + eq + encodeURIComponent(value)
  qs = pairs.join sep
  host = urlObj.host || ''
  path = urlObj.path
  # strip ending / in host
  if host.match /\/$/
    host = host.substr(0, host.length - 1)
  # add leading / in path
  if not path.match /^\//
    path = '/' + path
  # add ending / in path
  if not path.match /\/$/
    path = path + '/'
  url = host + path
  # strip off anchor #..
  if url.match /#/
    url = url.substr 0, url.indexOf '#'
  # append querystring
  if qs.length > 0
    if url.match /\?/
      url += sep + qs
    else
      url += '?' + qs
  return url
