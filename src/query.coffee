
Connection = require('./connection').Connection

# Task top level properties
top_level =
  id: true
  name: true
  project_id: true
  template_id: true
  duplication: true
  replication: true
  created_at: true
  updated_at: true
  expires_at: true

###
* Query for tasks
* Rich query mechanism
###

class Query extends Connection

  constructor: ->
    @get_path = 'tasks.json'
    @constraints = []
    @l = false

  where: (prop, value) ->
    @constraints.push prop: prop, value: value

  limit: (l) ->
    @l = l

  run: (callback) ->
    Query.get @get_path, (r) =>
      tasks = r.map (t) ->
        t.task
      tasks = tasks.filter( (task) ->
        @constraints.every (c) ->
          if c.prop of top_level
            task[c.prop] is c.value
          else
            task.parameters[c.prop] is c.value
      , this)
      if @l
        tasks = tasks.slice 0, @l
      callback tasks

exports.Query = Query
