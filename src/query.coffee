#### Query for tasks
# Rich mechanism to specify exactly which tasks you would like,
# using property comparisons, limits and other constraints.
#
# A `Query` object is usually obtained using `$dm.getTasks()`.
# Then one applies constraints one-by-one using the object.
# These can be daisy-chained, or not.
# Finally, the query is run against the server when `.run(callback)` is
# invoked on that object.
#
# A simple fetch of 10 tasks ordered by their `id` is
#
#     q = $dm.getTasks()
#     q.order_by('id')
#      .limit(10)
#      .run(cb)
#
# Where `cb` could have the form
#
#     function cb(err, tasks) {
#       if (err) {
#         ...
#       }
#       ...
#     }
#

# Requirements
_ = require 'underscore'
Store = require('./store').Store
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

class Query extends Connection

  constructor: ->
    project_id = Store.project_id()
    @get_path = "/api/v1/projects/#{project_id}/tasks.json"
    @constraints = []
    @ordering = false
    @limited = false
    @options = {}

  # Check for equality of any property, usually in `task.parameters`
  #
  #     q.eq('project_id', 100)
  #
  # Top level properties like `id` and `project_id` are treated separated,
  # but by default the property is assumed to come from the `task.parameters`
  # dictionary
  eq: (prop, value) ->
    @constraints.push op: 'eq', prop: prop, value: value
    this

  # Synonym for `q.eq(...)`
  where: Query::eq

  # Inequailty of a property in `task.parameters`, else behaves as `q.eq(...)`
  #
  #     q.ne('transscription_type', 'math')
  #
  ne: (prop, value) ->
    @constraints.push op: 'ne', prop: prop, value: value
    this

  # Check if the task has been answered
  #
  #     q.iscomplete(false)
  #
  iscomplete: (value) ->
    if not value
      @get_path = @get_path.replace /\.json$/, '/open.json'
    this

  # Sort the array of tasks returned through the callback.
  # Uses the same property resolution as `q.eq(...)`
  #
  #     q.order_by('template_id')
  #
  # For a random ordering
  #
  #     q.order_by('?')
  #
  order_by: (o) ->
    @ordering = o
    this

  # Limit the array of tasks returned to `l` tasks
  #
  #     q.limit(10)
  #
  # Even if one sets `q.limit(1)`, an array of tasks is passed to the callback,
  # in that case with 1 task
  limit: (l) ->
    @limited = l
    this

  # Set the `access_token` to be passed to dormouse to authenticate as a user
  #
  #     q.authenticate('332fq43rqdafs')
  #
  # Useful for the example shown of identifying a user
  authenticate: (token) ->
    @options['access_token'] = token
    this

  # Run the query against the server,
  # then return the tasks matching all the constraints through the `callback`
  # parameter.
  # See the initial description for a simple example of `q.run(...)`
  #
  # The `err` argument in the callback is only ever non-null if there was an
  # error with the task fetching.
  # It goes without saying that the result of the fetch cannot be trusted if
  # there was an error.
  run: (callback) ->
    Query.get @get_path, @options, (err, r) =>
      return callback err, r if err
      tasks = r.map (t) ->
        t.task
      tasks = tasks.filter @check_constraints, this
      if @ordering
        tasks = @apply_ordering tasks
      if @limited
        tasks = tasks.slice 0, @limited
      if tasks.length
        callback null, tasks
      else
        callback 'No tasks matching constraints', null

  #### Private methods

  # Check each constraint
  check_constraints: (task) ->
    @constraints.every (c) ->
      if c.prop of top_level
        task_value = task[c.prop]
      else
        task_value = task.parameters[c.prop]
      switch c.op
        when 'ne'
          task_value isnt c.value
        else
          # assumption that operation is `eq`
          task_value is c.value

  # Apply the ordering given by `q.order_by(...)`
  apply_ordering: (tasks) ->
    if @ordering is '?'
      _.shuffle tasks
    else
      top_level_prop = @ordering of top_level
      _.sortBy tasks, (task) ->
        if top_level_prop then task[@ordering] else task.parameters[@ordering]
      , this

exports.Query = Query
