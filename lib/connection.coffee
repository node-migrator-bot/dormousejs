
path = require 'path'
async = require 'async'

DM_URL = 'http://arya.stanford.edu:3777/'

###
Base Connection
###
class Connection

  ###
  @param options serialized in GET params
  ###
  get: (path, options, callback) ->
    # XXX TODO implementation, append api_key
    request = new XMLHttpRequest()
    path.join DM_URL, path
    # callback error, response

  ###
  @param options appended to URL
  @param body dumped in POST body
  ###
  post: (path, options, body, callback) ->
    # XXX TODO implementation

  ###
  @param options appended to URL
  @param body dumped in body
  ###
  put: (path, options, body, callback) ->
    # XXX TODO implementation

  ###
  @param options is optional
  ###
  delete: (path, options, callback) ->
    # XXX TODO implementation

  getIds: ->
    ids = libutils.toArray(arguments)
    get_path = ids.shift()
    callback = ids.pop()
    if (libutils.isEmpty(ids))
      return this.get(get_path, callback)
    else
      ids.map (id) ->
        return "#{id}.json"
      # async.forEach
    # XXX TODO implementation
