var Authentication, Connection, Dormouse, Projects, Store, Tasks;

require('./mixin');

Store = require('./store').Store;

Connection = require('./connection').Connection;

Authentication = require('./auth').Authentication;

Tasks = require('./tasks').Tasks;

Projects = require('./projects').Projects;

Dormouse = (function() {

  function Dormouse() {}

  Dormouse.implements(Store, Authentication, Tasks, Projects);

  return Dormouse;

})();

module.exports = Dormouse;
