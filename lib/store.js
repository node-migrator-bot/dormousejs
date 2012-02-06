var Store, access_token, api_key, host, port, project_id, user;

host = 'dormou.se';

port = 80;

api_key = null;

project_id = null;

access_token = null;

user = null;

Store = (function() {

  function Store() {}

  Store.server = function(setter) {
    var matched;
    if (setter) {
      matched = setter.match(/^((https?):\/\/)?([A-Za-z0-9\.]+)(:(\d+))?\/?$/);
      if (matched) {
        host = matched[3] || 'dormou.se';
        port = matched[5] || 80;
      } else {
        throw new Error('Improperly formatted url passed to Dormouse.server(...)');
      }
    }
    return "http://" + host + ":" + port;
  };

  Store.host = function(setter) {
    if (setter) host = setter;
    return host;
  };

  Store.port = function(setter) {
    if (setter) port = setter;
    return port;
  };

  Store.api_key = function(setter) {
    if (setter) api_key = setter;
    if (!api_key) {
      throw new Error('You cannot make API calls without an api_key. Set it using Dormouse.api_key(...)');
    }
    return api_key;
  };

  Store.project_id = function(setter) {
    if (setter) project_id = setter;
    if (!project_id) {
      throw new Error('You cannot make some API calls without a project_id. Set it using Dormouse.project_id(...)');
    }
    return project_id;
  };

  Store.access_token = function(setter) {
    if (setter) access_token = setter;
    return access_token;
  };

  Store.user = function(setter) {
    if (setter) user = setter;
    if (!user) {
      throw new Error('You cannot make some API calls without a user. Set it using Dormouse.user(...)');
    }
    return user;
  };

  return Store;

})();

exports.Store = Store;
