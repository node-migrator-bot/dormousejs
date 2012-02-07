# Methods needed for authentication with Dormouse
#
# Structure of the `user` returned by dormouse
#
#     { admin: true,
#      created_at: '2012-01-27T06:55:55Z',
#      developer: true,
#      fullname: 'Zahan Malkani',
#      id: 1,
#      updated_at: '2012-01-27T06:56:13Z',
#      username: 'zahanm' }
#

# Need constants from Store
Store = require('./store').Store
Connection = require('./connection').Connection

# Dummy class with some getter methods
class Authentication

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
  
  # logout url
  @logout_url: (client_server) ->
    "http://#{client_server}/logout"

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
      Connection.get '/oauth/access_token.json', {
        project_id: project_id
        api_key: api_key
        code: code
      }, (err, r) ->
        # TODO error checking
        req.session.access_token = r['access_token']
        Connection.get '/api/v1/users/current.json', {
          access_token : req.session.access_token
        }, (err, r) ->
          # TODO error checking
          req.session.user = r['user']
          res.redirect '/'
    
    app.get '/logout', (req, res) ->
      req.session.access_token = null
      req.session.user = null
      res.redirect '/'

exports.Authentication = Authentication
