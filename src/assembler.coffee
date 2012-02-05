# **dormousejs** is a javascript library to help access the
# [dormouse](http://dormou.se) crowdsourcing platform's API.
#
# It is compatible with the **node.js** engine, and can be installed
# in one line
#
# 		npm install dormouse
#
# It can also be used in *modern* **browsers** by including the bundled
# file found in `dist/dormouse.js`

#### Features
#
# - Connects to specifiable dormouse server
# - queues tasks
# - receives responses
# - Includes a [task query API](query.html)
# - Rendering of task templates using the {{ [mustache.js](http://mustache.github.com/) }} style

#### First steps
#
# - If client-side, use the global `$dm` object
# - If server-side, `require('dormouse')` to get the object
# - Use the setter methods, `$dm.server(...)` and `$dm.api_key(...)` to access Dormouse
# - Start playing with tasks from your favorite project using `$dm.getTasks(...)`

#### And now for code

# Requirements
require './mixin'
Store = require('./store').Store
Connection = require('./connection').Connection
Tasks = require('./tasks').Tasks
Projects = require('./projects').Projects

# This is accessed through `window.$dm` in the browser and
# `require('dormouse')` in node.js
#
# To see what other methods are available on the `dormouse` object
# look at **tasks.coffee** and **projects.coffee**
class Dormouse
  # Store, Tasks, Projects are *mixins*
  @implements Store, Tasks, Projects

module.exports = Dormouse
