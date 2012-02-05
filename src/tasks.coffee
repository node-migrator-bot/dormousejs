# Here you can see the methods on `dormouse` pertaining to tasks
#
#### Task structure on API
# The starred properties are required to create a new task
#
#     {
#       id: 1234,
#       name: "ManReduce-Step-1",
#     * project_id: 11,
#     * template_id: 7,
#       duplication: 1,
#       replication: 1,
#       created_at: "2011-10-14T14:02:47Z",
#       updated_at: "2011-10-14T14:02:47Z",
#       expires_at: "",
#       eligibility: {
#         communities: [],
#         predicate: null
#       },
#     * parameters: {
#         question: "blah",
#         type: "abc"
#       }
#     }
#
#### Template formatting
# Templates follow {{ [mustache.js](http://mustache.github.com/) }} style.
# Uses the `task.parameters` object as a context for the template,
# but copies over a few top level properties before doing so.
#
# A simple template example is
#
#     <p>Here is {{ name }} task</p>
#     <p>It is of {{ type }} type</p>
#

#### And now for code

# Store, Connection and Query needed.
Store = require('./store').Store
Connection = require('./connection').Connection
Query = require('./query').Query

# Templating settings
_ = require 'underscore'
_.templateSettings =
  interpolate : /\{\{(.+?)\}\}/g

# Mixin for Dormouse with methods to manipulate tasks
class Tasks extends Connection

  # Fetch a task from Dormouse
  #
  # @param id of task
  @getTask: (id, callback) ->
    @get "/api/v1/tasks/#{id}.json", (err, r) ->
      if err then callback err, r
      else callback null, r.task

  # Fetches all tasks for the current project from Dormouse.
  #
  # Look at **query.coffee** for the structure of the returned object
  @getTasks: (callback) ->
    q = new Query()
    if callback and typeof callback is 'function'
      q.run callback
    q

  # Render the `task` in HTML assumpting that `snippet` is a raw HTML template.
  #
  # Makes no allowances for escaped HTML, it will be returned as escaped too.
  # You can safely use `document.body.innerHTML` here.
  @render: (snippet, task) ->
    template = _.template snippet
    context = {}
    _.extend context, task.parameters
    ['id', 'name', 'project_id', 'template_id'].forEach (prop) ->
      context[prop] = task[prop]
    template context

  # @param task_info object following the format outlined in the task structure
  # section
  #
  # @callback `{ status: 'created', location: 1234 }`
  @createTask: (task_info, callback) ->
    required_fields = [ 'project_id', 'template_id', 'parameters' ]
    for field in required_fields
      throw new Error "Required field for task creation: #{field}" unless field of task_info
    task_info.eligibility ?= predicate: null, communities: []
    task_info.replication ?= 1
    task_info.duplication ?= 1
    project_id = Store.project_id()
    post_path = "/api/v1/projects/#{project_id}/tasks.json"
    this.post post_path, {}, { 'task': task_info }, callback

  @answerTask: (task_id, answer_info, callback) ->
    post_path = "/api/v1/tasks/#{task_id}/responses.json"
    this.post post_path, {}, { 'response': answer_info }, callback

  @deleteTask: (task_id, callback) ->
    delete_path =  "/api/v1/tasks/#{task_id}.json"
    this.delete delete_path, callback

exports.Tasks = Tasks
