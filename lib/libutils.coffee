
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
  path: '/some/relative/path' [no host]
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
  url = urlObj.path || '/'
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
