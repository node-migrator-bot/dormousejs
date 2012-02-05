#### Constant Storage for dormouse
# Where all the constants are stored, using closures

# beauty of closures
host = 'dormou.se'
port = 80
api_key = ''
project_id = ''

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
    "http://#{host}:#{port}/"

  @host: (setter) ->
    if setter
      host = setter
    host

  @port: (setter) ->
    if setter
      port = setter
    port

  # get or set the `dormouse` api_key to identify the developer of the app
  @api_key: (setter) ->
    if setter
      api_key = setter
    unless api_key
      throw new Error 'You cannot make API calls without an api_key. Set it using Dormouse.api_key(...)'
    api_key

  # Get or set project_id
  # optional param: `id` of project
  @project_id: (id) ->
    if id
      project_id = id
    unless project_id
      throw new Error 'You cannot make API calls without a project_id. Set it using Dormouse.project_id(...)'
    project_id

exports.Store = Store
