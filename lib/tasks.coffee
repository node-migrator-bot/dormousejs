
###

Task structure on API

{
  id: '1234',
  question: 'What is the speed of a European swallow-tailed swift?'
}

###

path = require 'path'

###
* Tasks mixin for Dormouse
* basic API operations
###
class Tasks extends Connection

  ###
  @param ids = ids of tasks to fetch, optional
  ###
  getTasks: (ids, callback) ->
    get_path = 'tasks.json'
    args = [ get_path ].concat arguments
    return this.getIds.apply this, args

  createTask: (task_info, callback) ->
    post_path = 'tasks.json'
    return this.post post_path, task_info, callback

  performTask: (task, callback) ->
    get_path = path.join 'tasks', task.id, 'perform.json'
    return this.get get_path, callback

  answerTask: (task, answer_info, callback) ->
    put_path = path.join 'tasks', task.id, 'answer.json'
    return this.put put_path, answer_info, callback

  deleteTask: (task, callback) ->
    delete_path = path.join 'tasks', "#{task.id}.json"
    return this.delete delete_path, callback
