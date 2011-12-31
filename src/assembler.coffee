# **dormousejs** is a javascript library to help access the
# [dormouse](http://dormou.se) crowdsourcing platform's API.

# It is compatible with the **node.js** engine, and can be installed
# in one line
#
# 		npm install dormouse

#### Features

# - Connects to specifiable dormouse server
# - queues tasks
# - receives responses
# - *modern* browser friendly
# - also supports server-side js with Node 0.4+
# - Includes a task Query API
# - Rendering of task templates using the {{ [mustache.js](http://mustache.github.com/) }} style

#### First steps

# - set `$dm.server` and `$dm.api_key` to access dormouse
# - use the `$dm` object

require './mixin'
Connection = require('./connection').Connection
Tasks = require('./tasks').Tasks
Projects = require('./projects').Projects

# Top level Dormouse

class Dormouse
  @implements Tasks, Projects
  # Tasks, Projects are mixins

  @server: () ->
    Connection.server.apply Connection, arguments

  @api_key: () ->
    Connection.api_key.apply Connection, arguments

module.exports = Dormouse
