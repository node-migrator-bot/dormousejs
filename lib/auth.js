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

  Authentication.is_authenticated = function() {
    return Boolean(Store.access_token());
  };

  Authentication.login_url = function(client_server) {
    var dm_server, project_id;
    dm_server = Store.server();
    project_id = Store.project_id();
    return "" + dm_server + "/api/v1/plugins/new_session?project_id=" + project_id + "&redirect_uri=http://" + client_server + "/authenticate";
  };

  Authentication.signup_url = function(client_server) {
    var dm_server, project_id;
    dm_server = Store.server();
    project_id = Store.project_id();
    return "" + dm_server + "/api/v1/plugins/new_account?project_id=" + project_id + "&redirect_uri=http://" + client_server + "/authenticate";
  };

  Authentication.setup_auth = function(app) {
    return app.get('/authenticate', function(req, res) {
      var api_key, code, project_id;
      project_id = Store.project_id();
      api_key = Store.api_key();
      parsed_url(url.parse(req.url, true));
      code = parsed_url.query['code'];
      conosle.info(code);
      return this.get('/oauth/access_token.json', {
        project_id: project_id,
        api_key: api_key,
        code: code
      }, function(r) {
        Store.access_token(r['access_token']);
        console.info(Store.access_token());
        return this.get('/api/v1/users/current.json', {
          access_token: Store.access_token()
        }, function(r) {
          Store.user(r['user']);
          console.info(Store.user());
          return res.redirect('/');
        });
      });
    });
  };

  return Authentication;

})(Connection);

exports.Authentication = Authentication;
