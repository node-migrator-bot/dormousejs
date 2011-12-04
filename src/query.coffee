
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
        task = t.task
        @constraints.every (c) ->
          task[c.prop] is c.value
      console.assert @limit, 'context not set properly from Connection'
      callback tasks.slice 0, @limit
