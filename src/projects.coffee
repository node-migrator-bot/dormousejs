
###

Project structure on API

{
  id: '1234',
  template: '2561'
}

###

path = require 'path'
Connection = require('./connection').Connection

###
* Projects mixin for Dormouse
* basic API operations
###
class Projects extends Connection

  ###
  @param ids = ids of projects to fetch, optional
  ###
  getProjects: (ids, callback) ->
    get_path = 'projects.json'
    args = Array::concat.apply [ get_path ], arguments
    return this.getIds.apply this, args

  createProject: (project_info, callback) ->
    post_path = 'projects.json'
    return this.post post_path, project_info, callback

  editProject: (project, callback) ->
    put_path = path.join 'projects', "#{project.id}.json"
    return this.put put_path, project, callback

  deleteProject: (project, callback) ->
    delete_path = path.join 'projects', "#{project.id}.json"
    return this.delete delete_path, callback

exports.Projects = Projects