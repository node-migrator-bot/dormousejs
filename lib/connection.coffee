
###
Base Connection
###

DM_URL = 'http://arya.stanford.edu:3777/';

class Connection

  ###
  @param options serialized in GET params, optional
  ###
  get: (path, options, callback) ->
    # XXX TODO implementation
    request = new XMLHttpRequest()
    path.join DM_URL, path

  ###
  @param options dumped in POST body, optional
  ###
  post: (path, options, callback) ->
    # XXX TODO implementation

  ###
  @param options is optional
  ###
  put: (path, options, callback) ->
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
    # XXX TODO implementation
