
path = require 'path'
async = require 'async'

DM_URL = 'http://arya.stanford.edu:3777/'

###
Base Connection
###
class Connection

  ###
  Assumption that it is getting JSON
  @param options serialized in GET params
  ###
  get: (get_path, options, callback) ->
    # XXX TODO implementation, append api_key
    get_path = path.join DM_URL, get_path
    request = new XMLHttpRequest
    request.open('GET', get_path, true)
    request.onreadystatechange = (e) ->
      if (request.readyState is 4)
        console.log request.responseText
        callback JSON.parse request.responseText
      else
        console.log 'Error', request.statusText
        callback request.statusText
    request.send null

  ###
  @param options appended to URL
  @param body dumped in POST body
  ###
  post: (post_path, options, body, callback) ->
    # XXX TODO implementation

  ###
  @param options appended to URL
  @param body dumped in body
  ###
  put: (put_path, options, body, callback) ->
    # XXX TODO implementation

  ###
  @param options is optional
  ###
  delete: (delete_path, options, callback) ->
    # XXX TODO implementation

  getIds: ->
    ids = libutils.toArray(arguments)
    get_path = ids.shift()
    callback = ids.pop()
    if (libutils.isEmpty(ids))
      this.get get_path, callback
    else
      items = []
      async.forEach(ids, (id, done) ->
        id_path = path.join get_path, "#{id}.json"
        this.get id_path, (item) ->
          items.push(item)
          done()
      , (err) ->
        if err
          callback(false)
        else
          callback(items)
      ) # END async.forEach
