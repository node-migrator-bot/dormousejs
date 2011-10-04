
###
utils for simplify detecting types and stuff
###

libutils = exports

libutils.isEmpty = (obj) ->
  for own prop of obj
    return false
  return true

libutils.isArray = (obj) ->
  return obj instanceof Array

libutils.toArray = (array_like) ->
  return Array.prototype.slice.call array_like
