# Methods needed for authentication with Dormouse

# Node dependencies
url = require 'url'

# Need constants from Store
Store = require('./store').Store
Connection = require('./connection').Connection

# Dummy class with some getter methods
class Authentication extends Connection

  # Returns a login url on the dormouse site
  @login_url: () ->
    server = Store.server()
    project_id = Store.project_id()
    "#{server}/api/v1/plugins/new_session?project_id=#{project_id}&redirect_uri=http://#{request.host_with_port}/authenticate"
    # TODO XXX request.host_with_port
  
  # passed in an `express` app, will setup paths to handle the auth
  # *must be done server-side*
  @setup_auth: (app) ->
    app.get '/authenticate', (req, res) ->
      res.end 'Successful'

      project_id = Store.project_id()
      api_key = Store.api_key()
      parsed_url url.parse req.url, true
      code = parsed_url.query['code']
      @get "/oauth/access_token?", {
        project_id: project_id
        api_key: api_key
        code: code
      }, (r) ->
        Store.access_token(r['access_token'])

