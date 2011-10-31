
path = require 'path'
async = require 'async'

libutils = require './libutils'

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
    # TODO append api_key, options
    get_path = path.join DM_URL, get_path
    request = new XMLHttpRequest
    request.open 'GET', get_path, true
    # response handler
    request.onload = (e) ->
      if request.status is 200
        console.log request.responseText # DEBUG
        callback parseResponse request.responseText if callback
      else
        console.log 'HTTP error', request.status
        callback request.statusText if callback
    request.send null

  ###
  @param options appended to URL
  @param body dumped in POST body
  ###
  post: (post_path, options, body, callback) ->
    # TODO append api_key, options
    post_path = path.join DM_URL, post_path
    request = new XMLHttpRequest
    request.open 'POST', post_path, true
    request.setRequestHeader 'Content-Type', 'application/json'
    # response handler
    request.onload = (e) ->
      if request.status is 200
        console.log request.responseText # DEBUG
        callback parseResponse request.responseText if callback
      else
        console.log 'HTTP error', request.status
        callback request.statusText if callback
    request.send JSON.stringify body

  ###
  @param options appended to URL
  @param body dumped in body
  ###
  put: (put_path, options, body, callback) ->
    # TODO append api_key, options
    put_path = path.join DM_URL, put_path
    request = new XMLHttpRequest
    request.open 'PUT', put_path, true
    request.setRequestHeader 'Content-Type', 'application/json'
    # response handler
    request.onload = (e) ->
      if request.status is 200
        console.log request.responseText # DEBUG
        callback parseResponse request.responseText if callback
      else
        console.log 'HTTP error', request.status
        callback request.statusText if callback
    request.send JSON.stringify body

  ###
  @param options is optional
  ###
  delete: (delete_path, options, callback) ->
    # TODO append api_key, options
    delete_path = path.join DM_URL, delete_path
    request = new XMLHttpRequest
    request.open 'DELETE', delete_path, true
    # response handler
    request.onload = (e) ->
      if request.status is 200
        console.log request.responseText # DEBUG
        callback parseResponse request.responseText if callback
      else
        console.log 'HTTP error', request.status
        callback request.statusText if callback
    request.send null

  getIds: ->
    ids = libutils.toArray arguments
    get_path = ids.shift()
    callback = ids.pop()
    if (libutils.isEmpty ids)
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

parseResponse = (raw_response) ->
  try
    return JSON.parse raw_response
  catch syntax_error
    console.log 'Response JSON parsing error:', syntax_error
  return raw_response

exports.Connection = Connection
