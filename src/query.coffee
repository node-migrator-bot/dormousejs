
_ = require 'underscore'
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
  responses: true

# * Query for tasks
# * Rich query mechanism
class Query extends Connection

  constructor: ->
    @get_path = 'tasks.json'
    @constraints = []
    @ordering = false
    @limited = false

  eq: (prop, value) ->
    @constraints.push op: 'eq', prop: prop, value: value
    this

  where: Query::eq

  ne: (prop, value) ->
    @constraints.push op: 'ne', prop: prop, value: value
    this

  iscomplete: (value) ->
    @constraints.push op: 'iscomplete', prop: 'responses', value: value
    this

  check_constraints: (task) ->
    @constraints.every (c) ->
      if c.prop of top_level
        task_value = task[c.prop]
      else
        task_value = task.parameters[c.prop]
      switch c.op
        when 'ne'
          task_value isnt c.value
        when 'iscomplete'
          complete = task_value and task_value.length
          if c.value then complete else not complete
        else
          task_value is c.value

  order_by: (o) ->
    @ordering = o
    this

  apply_ordering: (tasks) ->
    if @ordering is '?'
      _.shuffle tasks
    else
      _.sortBy tasks, (task) ->
        if @ordering of top_level
          task[@ordering]
        else
          task.parameters[@ordering]
      , this

  limit: (l) ->
    @limited = l
    this

  run: (callback) ->
    Query.get @get_path, (err, r) =>
      return callback err, r if err
      tasks = r.map (t) ->
        t.task
      tasks = tasks.filter @check_constraints, this
      if @ordering
        tasks = @apply_ordering tasks
      if @limited
        tasks = tasks.slice 0, @limited
      callback null, tasks

exports.Query = Query
