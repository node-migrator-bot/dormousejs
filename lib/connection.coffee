
path = require 'path'
async = require 'async'
_ = require 'underscore'
http = require 'http-browserify'

libutils = require './libutils'

###
Base Connection
###
class Connection

  ###
  Assumption that it is getting JSON
  @param options serialized in GET params
  ###
  get: (get_path, options, callback) ->
    get_path = libutils.formatUrl
      path: get_path
      query: appendAPIKey options
    req = http.request
      method: 'GET'
      host: Connection.host()
      port: Connection.port()
      path: get_path
    , (res) ->
      handleResponse res, callback
    # END http.request
    req.end() # sends the request

  ###
  @param options appended to URL
  @param body dumped in POST body
  ###
  post: (post_path, options, body, callback) ->
    post_path = libutils.formatUrl
      path: post_path
      query: appendAPIKey options
    req = http.request
      method: 'POST'
      host: Connection.host()
      port: Connection.port()
      path: post_path
      headers:
        'Content-Type': 'application/json'
    , (res) ->
      handleResponse res, callback
    # END http.request
    req.end JSON.stringify body

  ###
  @param options appended to URL
  @param body dumped in body
  ###
  put: (put_path, options, body, callback) ->
    put_path = libutils.formatUrl
      path: put_path
      query: appendAPIKey options
    req = http.request
      method: 'PUT'
      host: Connection.host()
      port: Connection.port()
      path: put_path
      headers:
        'Content-Type': 'application/json'
    , (res) ->
      handleResponse res, callback
    # END http.request
    req.end JSON.stringify body

  ###
  @param options is optional
  ###
  delete: (delete_path, options, callback) ->
    delete_path = libutils.formatUrl
      path: delete_path
      query: appendAPIKey options
    req = http.request
      method: 'DELETE'
      host: Connection.host()
      port: Connection.port()
      path: delete_path
    , (res) ->
      handleResponse res, callback
    # END http.request
    req.end()

  getIds: ->
    ids = libutils.toArray arguments
    get_path = ids.shift()
    callback = ids.pop()
    if (libutils.isEmpty ids)
      this.get get_path, {}, callback
    else
      items = []
      async.forEach(ids, (id, done) ->
        id_path = path.join get_path, "#{id}.json"
        this.get id_path, {}, (item) ->
          items.push(item)
          done()
      , (err) ->
        if err
          callback(false)
        else
          callback(items)
      ) # END async.forEach

# --- static methods

protocol = 'http'
host = 'dormou.se'
port = 3777 # 80
Connection.server = (setter) ->
  if setter
    # TODO parse setter into host and port
    host = setter
  return "#{protocol}://#{host}:#{port}"

Connection.host = (setter) ->
  if setter
    host = setter
  return host

Connection.port = (setter) ->
  if setter
    port = setter
  return port

api_key = ''
Connection.api_key = (setter) ->
  if setter
    api_key = setter
  return api_key

# --- private methods

appendAPIKey = (options) ->
  return _.extend options, { api_key: Connection.api_key() }

handleResponse = (res, callback) ->
  data = ''
  res.on 'data', (buf) ->
    data += buf
  res.on 'end', () ->
    callback parseResponse data if callback
  res.on 'error', (err) ->
    console.log 'HTTP error', res.statusCode, data, err

parseResponse = (raw_response) ->
  try
    return JSON.parse raw_response
  catch syntax_error
    console.log 'Response JSON parsing error:', syntax_error
  return raw_response

exports.Connection = Connection
