
DM_URL = 'http://arya.stanford.edu:3777/';

class connection

  ###
  @param options serialized in GET params, optional
  ###
  get: (path, options, callback) ->
    # XXX TODO implementation
    request = new XMLHttpRequest()

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

base = require('./lib/base').connection
tasks = require('./tasks').tasks;

class Dormouse extends Base
  @implements Tasks
  # tasks is a mixin

# global on the server, window in the browser
var root = this;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dormouse;
} else {
    root.$dm = Dormouse;
}
