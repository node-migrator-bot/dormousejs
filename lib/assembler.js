var Connection, Dormouse, Projects, Tasks;

require('./mixin');

Connection = require('./connection').Connection;

Tasks = require('./tasks').Tasks;

Projects = require('./projects').Projects;

Dormouse = (function() {

  function Dormouse() {}

  Dormouse.implements(Tasks, Projects);

  Dormouse.server = function() {
    return Connection.server.apply(Connection, arguments);
  };

  Dormouse.api_key = function() {
    return Connection.api_key.apply(Connection, arguments);
  };

  return Dormouse;

})();

module.exports = Dormouse;
