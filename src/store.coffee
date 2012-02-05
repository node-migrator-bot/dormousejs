#### Constant Storage for dormouse
# Where all the constants are stored, using closures

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

  host = 'dormou.se'
  @host: (setter) ->
    if setter
      host = setter
    host

  port = 80
  @port: (setter) ->
    if setter
      port = setter
    port

  # get or set the `dormouse` api_key to identify the developer of the app
  api_key = ''
  @api_key: (setter) ->
    if setter
      api_key = setter
    unless api_key
      throw new Error 'You cannot make API calls without an api_key. Set it using Dormouse.api_key(...)'
    api_key

exports.Store = Store
