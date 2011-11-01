
path = require 'path'
async = require 'async'
_ = require 'underscore'
http = require 'http-browserify'

libutils = require './libutils'

DM_HOST = 'arya.stanford.edu'
DM_PORT = 3777
API_KEY = '6b044f121358683678e5e21de2202a5e0a0394d5'

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
      host: DM_HOST
      port: DM_PORT
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
      host: DM_HOST
      port: DM_PORT
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
      host: DM_HOST
      port: DM_PORT
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
      host: DM_HOST
      port: DM_PORT
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

appendAPIKey = (options) ->
  return _.extend options, { api_key: API_KEY }

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
