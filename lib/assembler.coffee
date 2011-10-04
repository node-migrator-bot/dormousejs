
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

exports.Dormouse = Dormouse
