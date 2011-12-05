
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

path = require 'path'
Connection = require('./connection').Connection
Query = require('./query').Query

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
  @getTasks: (id, callback) ->
    @get "tasks/#{id}.json", (r) ->
      callback r.task

  ###
  Fetches all tasks from Dormouse
  ###
  @getTasks: (callback) ->
    if not callback or typeof callback isnt 'function'
      new Query()
    else
      @get 'tasks.json', (r) ->
        callback r.map (t) ->
          t.task

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
    return this.post post_path, {}, { 'task': task_info }, callback

  @performTask: (task, callback) ->
    get_path = path.join 'tasks', task.id, 'perform.json'
    return this.get get_path, callback

  @answerTask: (task, answer_info, callback) ->
    put_path = path.join 'tasks', task.id, 'answer.json'
    return this.put put_path, {}, answer_info, callback

  @deleteTask: (task, callback) ->
    delete_path = path.join 'tasks', "#{task.id}.json"
    return this.delete delete_path, callback

exports.Tasks = Tasks
