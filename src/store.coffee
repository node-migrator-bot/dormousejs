#### Constants storage for dormouse
# Where all the constants are stored, using closures

# beauty of closures
host = 'dormou.se'
port = 80
api_key = null
project_id = null
access_token = null
user = null

# Just a dummy class with setters logic
class Store

  # get or set the `dormouse` server to connect to
  @server: (setter) ->
    if setter
      matched = setter.match /^((https?):\/\/)?([A-Za-z0-9\.]+)(:(\d+))?\/?$/
      if matched
        host = matched[3] || 'dormou.se'
        port = matched[5] || 80
      else
        throw new Error 'Improperly formatted url passed to Dormouse.server(...)'
    "http://#{host}:#{port}"

  @host: (setter) ->
    host = setter if setter
    host

  @port: (setter) ->
    port = setter if setter
    port

  # get or set the `dormouse` api_key to identify the developer of the app
  @api_key: (setter) ->
    api_key = setter if setter
    throw new Error 'You cannot make API calls without an api_key. Set it using Dormouse.api_key(...)' unless api_key
    api_key

  # Get or set project_id
  # optional param: `id` of project
  @project_id: (setter) ->
    project_id = setter if setter
    throw new Error 'You cannot make some API calls without a project_id. Set it using Dormouse.project_id(...)' unless project_id
    project_id

  # Used in oauth flow
  @access_token: (setter) ->
    access_token = setter if setter
    access_token

  # Used in oauth flow
  @user: (setter) ->
    user = setter if setter
    throw new Error 'You cannot make some API calls without a user. Set it using Dormouse.user(...)' unless user
    user

exports.Store = Store
