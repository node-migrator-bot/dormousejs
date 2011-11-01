
require './mixin'
Connection = require('./connection').Connection
Tasks = require('./tasks').Tasks
Projects = require('./projects').Projects

###
Top level Dormouse
###

class Dormouse
  @implements Tasks, Projects
  # Tasks, Projects are mixins

  server: () ->
    return Connection.server.apply(Connection, arguments)
  
  api_key: () ->
    return Connection.api_key.apply(Connection, arguments)

exports.Dormouse = Dormouse
