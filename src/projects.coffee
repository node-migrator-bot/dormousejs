#### Project manipulation methods
# Want to get project information or create a new one?
#
# Look no further.

#### Project structure on API
#
#     {
#       id: '1234',
#       template: '2561'
#     }

#### And now for code

path = require 'path'
Store = require('./store').Store
Connection = require('./connection').Connection

# * Projects mixin for Dormouse
# * basic API operations
class Projects extends Connection

  @getProject: (callback) ->
    project_id = Store.project_id()
    @getProjectFromID project_id, callback

  # Get a project from Dormouse
  # @param id of project to fetch
  @getProjectFromID: (id, callback) ->
    @get "/api/v1/projects/#{id}.json", (err, r) ->
      if err then callback err, r
      else callback null, r.project

  # TODO can be added back in once authentication is working
  # @createProject: (project_info, callback) ->
  #   user_id = Store.user_id()
  #   post_path = '/api/v1/users/#{user_id}/projects.json'
  #   this.post post_path, {}, project_info, callback

  @editProject: (project, callback) ->
    put_path = "/api/v1/projects/#{project.id}.json"
    this.put put_path, {}, project, callback

  @deleteProject: (project, callback) ->
    delete_path = "/api/v1/projects/#{project.id}.json"
    this.delete delete_path, callback

exports.Projects = Projects
