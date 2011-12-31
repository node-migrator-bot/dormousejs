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

#### And now for code

# Requirements
require './mixin'
Connection = require('./connection').Connection
Tasks = require('./tasks').Tasks
Projects = require('./projects').Projects

# This is accessed through `window.$dm` in the browser and
# `require('dormouse')` in node.js
#
# To see what other methods are available on the `dormouse` object
# look at **tasks.coffee** and **projects.coffee**
class Dormouse
  # Tasks, Projects are *mixins*
  @implements Tasks, Projects

  # get or set the `dormouse` server to connect to
  @server: () ->
    Connection.server.apply Connection, arguments

  # get or set the `dormouse` api_key to identify the developer of the app
  @api_key: () ->
    Connection.api_key.apply Connection, arguments

module.exports = Dormouse
