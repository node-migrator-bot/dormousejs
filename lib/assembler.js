var Connection, Dormouse, Projects, Store, Tasks;

require('./mixin');

Store = require('./store').Store;

Connection = require('./connection').Connection;

Tasks = require('./tasks').Tasks;

Projects = require('./projects').Projects;

Dormouse = (function() {

  function Dormouse() {}

  Dormouse.implements(Store, Tasks, Projects);

  return Dormouse;

})();

module.exports = Dormouse;
