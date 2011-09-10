
var libutils = exports;

libutils.isEmpty = function(obj) {
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};

libutils.isArray = function(obj) {
  return obj instanceof Array;
};

libutils.toArray = function(array_like) {
  return Array.prototype.slice.call(array_like);
};
