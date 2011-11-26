
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

  @server: () ->
    Connection.server.apply Connection, arguments

  @api_key: () ->
    Connection.api_key.apply Connection, arguments

module.exports = Dormouse
