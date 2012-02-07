var Authentication, Connection, Store;

Store = require('./store').Store;

Connection = require('./connection').Connection;

Authentication = (function() {

  function Authentication() {}

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
      code = req.query['code'];
      return Connection.get('/oauth/access_token.json', {
        project_id: project_id,
        api_key: api_key,
        code: code
      }, function(err, r) {
        req.session.access_token = r['access_token'];
        return Connection.get('/api/v1/users/current.json', {
          access_token: req.session.access_token
        }, function(err, r) {
          req.session.user = r['user'];
          return res.redirect('/');
        });
      });
    });
  };

  return Authentication;

})();

exports.Authentication = Authentication;
