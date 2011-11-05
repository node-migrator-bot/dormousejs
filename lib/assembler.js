var Connection, Dormouse, Projects, Tasks;
require('./mixin');
Connection = require('./connection').Connection;
Tasks = require('./tasks').Tasks;
Projects = require('./projects').Projects;
/*
Top level Dormouse
*/
Dormouse = (function() {
  function Dormouse() {}
  Dormouse.implements(Tasks, Projects);
  Dormouse.prototype.server = function() {
    return Connection.server.apply(Connection, arguments);
  };
  Dormouse.prototype.api_key = function() {
    return Connection.api_key.apply(Connection, arguments);
  };
  return Dormouse;
})();
exports.Dormouse = Dormouse;