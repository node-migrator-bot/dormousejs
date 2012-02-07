# Methods needed for authentication with Dormouse

# Need constants from Store
Store = require('./store').Store
Connection = require('./connection').Connection

# Dummy class with some getter methods
class Authentication extends Connection

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

  # Setup an app _server side_ to listen for the `/authenticate` call
  #
  # Needs `express`, with middleware `express.session` and `express.query`
  # activated for the current environment
  #
  # This is hard
  # Set up a endpoint that talks to the oauth backend for dormouse
  @setup_auth: (app) ->
    app.get '/authenticate', (req, res) ->
      project_id = Store.project_id()
      api_key = Store.api_key()
      code = req.query['code']
      conosle.info code
      @get '/oauth/access_token.json', {
        project_id: project_id
        api_key: api_key
        code: code
      }, (err, r) ->
        # TODO error checking
        req.session.access_token = r['access_token']
        console.info req.session.access_token
        @get '/api/v1/users/current.json', {
          access_token : req.session.access_token
        }, (err, r) ->
          # TODO error checking
          req.session.user = r['user']
          console.info req.session.user
          res.redirect '/'

exports.Authentication = Authentication
