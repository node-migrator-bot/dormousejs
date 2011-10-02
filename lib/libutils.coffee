
###
utils for simplify detecting types and stuff
###

namespace 'libutils', (exports, global) ->

  exports.isEmpty = (obj) ->
    for own prop of obj
      return false
    return true

  exports.isArray = (obj) ->
    return obj instanceof Array

  exports.toArray = (array_like) ->
    return Array.prototype.slice.call array_like
