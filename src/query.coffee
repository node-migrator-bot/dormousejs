
Connection = require('./connection').Connection

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
      tasks = tasks.filter (task) ->
        @constraints.every (c) ->
          task[c.prop] is c.value
      console.assert @limit isnt undefined, 'context not set properly from Connection'
      if @limit?
        tasks = tasks.slice 0, @limit
      callback tasks

exports.Query = Query
