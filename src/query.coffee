
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
    @contraints = []
    @limit = false

  where: (prop, value) ->
    @contraints.append prop: value

  limit: (l) ->
    @limit = l

  run: (callback) ->
    @get @get_path, (r) ->
      tasks = r.map (t) ->
        t.task
      tasks = tasks.filter (task) =>
        @constraints.every (c) ->
          if c.prop of top_level
            task[c.prop] is c.value
          else
            task.parameters[c.prop] is c.value
      console.assert @limit isnt undefined, 'context not set properly from Connection'
      if @limit?
        tasks = tasks.slice 0, @limit
      callback tasks

exports.Query = Query
