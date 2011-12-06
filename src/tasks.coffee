
###

Task structure on API

{
  id: 1234,
  name: "ManReduce-Step-1",
* project_id: 11,
* template_id: 7,
* duplication: 1,
* replication: 1,
  created_at: "2011-10-14T14:02:47Z",
  updated_at: "2011-10-14T14:02:47Z",
  expires_at: "",
* eligibility: {
    communities: [],
    predicate: null
  },
* parameters: {
    question: "blah"
  }
}

###

Connection = require('./connection').Connection
Query = require('./query').Query

_ = require 'underscore' # for templating
_.templateSettings =
  interpolate : /\{\{(.+?)\}\}/g

###
* Tasks mixin for Dormouse
* basic API operations
###
class Tasks extends Connection

  # --- static methods

  ###
  Fetch a task from Dormouse
  @param id of task
  ###
  @getTask: (id, callback) ->
    @get "tasks/#{id}.json", (err, r) ->
      if err then callback err, r
      else callback null, r.task

  ###
  Fetches all tasks from Dormouse
  ###
  @getTasks: (callback) ->
    q = new Query()
    if callback and typeof callback is 'function'
      q.run callback
    q

  @render: (snippet, task) ->
    template = _.template snippet
    context = {}
    _.extend context, task.parameters
    ['id', 'name', 'project_id', 'template_id'].forEach (prop) ->
      context[prop] = task[prop]
    template context

  ###
  @param task_info = object with the following required fields
      project_id. template_id, parameters
    and the following optional fields
      expires_at, name, eligibility, replication, duplication
  @callback { status: 'created', location: 1234 }
  ###
  @createTask: (task_info, callback) ->
    required_fields = [ 'project_id', 'template_id', 'parameters' ]
    for field in required_fields
      throw new Error "Required field for task creation: #{field}" unless field of task_info
    task_info.eligibility ?= predicate: null, communities: []
    task_info.replication ?= 1
    task_info.duplication ?= 1
    post_path = 'tasks.json'
    this.post post_path, {}, { 'task': task_info }, callback

  @answerTask: (task_id, answer_info, callback) ->
    put_path = "tasks/#{task_id}/answer.json"
    this.put put_path, {}, answer_info, callback

  @deleteTask: (task_id, callback) ->
    delete_path =  "tasks/#{task_id}.json"
    this.delete delete_path, callback

exports.Tasks = Tasks
