
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

  # --- static methods

  ###
  Get all projects from Dormouse
  @param id of project to fetch
  ###
  @getProject: (id, callback) ->
    @get "projects/#{id}.json", (err, r) ->
      if err then callback err, r
      else callback null, r.project

  ###
  Get all projects from Dormouse
  ###
  @getProjects: (callback) ->
    @get 'projects.json', (err, r) ->
      if err then callback err, r
      else callback null, r.map (p) ->
        p.project

  @createProject: (project_info, callback) ->
    post_path = 'projects.json'
    this.post post_path, {}, project_info, callback

  @editProject: (project, callback) ->
    put_path = path.join 'projects', "#{project.id}.json"
    this.put put_path, {}, project, callback

  @deleteProject: (project, callback) ->
    delete_path = path.join 'projects', "#{project.id}.json"
    this.delete delete_path, callback

exports.Projects = Projects
