var Store, api_key, host, port, project_id;

host = 'dormou.se';

port = 80;

api_key = '';

project_id = '';

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

  Store.project_id = function(id) {
    if (id) project_id = id;
    if (!project_id) {
      throw new Error('You cannot make API calls without a project_id. Set it using Dormouse.project_id(...)');
    }
    return project_id;
  };

  return Store;

})();

exports.Store = Store;
