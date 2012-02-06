# Methods needed for authentication with Dormouse

# Node dependencies
url = require 'url'

# Need constants from Store
Store = require('./store').Store
Connection = require('./connection').Connection

# Dummy class with some getter methods
class Authentication extends Connection

  @is_authenticated: () ->
    Boolean Store.access_token()

  # Returns a login url on the dormouse site
  @login_url: (client_server) ->
    dm_server = Store.server()
    project_id = Store.project_id()
    "#{dm_server}/api/v1/plugins/new_session?project_id=#{project_id}&redirect_uri=http://#{client_server}/authenticate"

  # Returns a signup url on the dormouse site
  @signup_url: (client_server) ->
    dm_server = Store.server()
    project_id = Store.project_id()
    "#{dm_server}/api/v1/plugins/new_account?project_id=#{project_id}&redirect_uri=http://#{client_server}/authenticate"

  # passed in an `express` app, will setup paths to handle the auth
  # *must be done server-side*
  @setup_auth: (app, server_store) ->
    app.get '/authenticate', (req, res) ->
      project_id = Store.project_id()
      api_key = Store.api_key()
      parsed_url url.parse req.url, true
      code = parsed_url.query['code']
      conosle.info code
      @get '/oauth/access_token.json', {
        project_id: project_id
        api_key: api_key
        code: code
      }, (r) ->
        if server_store
          server_store.access_token = r['access_token']
        else
          Store.access_token r['access_token']
        console.info Store.access_token()
        @get '/api/v1/users/current.json', {
          access_token : Store.access_token()
          }, (r) ->
            if server_store
              server_store.user = r['user']
            else
              Store.user r['user']
            console.info Store.user()
            res.redirect '/'

exports.Authentication = Authentication
