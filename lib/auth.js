var Authentication, Connection, Store, url,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

url = require('url');

Store = require('./store').Store;

Connection = require('./connection').Connection;

Authentication = (function(_super) {

  __extends(Authentication, _super);

  function Authentication() {
    Authentication.__super__.constructor.apply(this, arguments);
  }

  Authentication.login_url = function() {
    var project_id, server;
    server = Store.server();
    project_id = Store.project_id();
    return "" + server + "/api/v1/plugins/new_session?project_id=" + project_id + "&redirect_uri=http://" + request.host_with_port + "/authenticate";
  };

  Authentication.setup_auth = function(app) {
    return app.get('/authenticate', function(req, res) {
      var api_key, code, project_id;
      res.end('Successful');
      project_id = Store.project_id();
      api_key = Store.api_key();
      parsed_url(url.parse(req.url, true));
      code = parsed_url.query['code'];
      return this.get("/oauth/access_token?", {
        project_id: project_id,
        api_key: api_key,
        code: code
      }, function(r) {
        return Store.access_token(r['access_token']);
      });
    });
  };

  return Authentication;

})(Connection);
