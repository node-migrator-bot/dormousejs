var implements;
var __slice = Array.prototype.slice;
implements = function() {
  var classes, getter, klass, prop, setter, _i, _len;
  classes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  for (_i = 0, _len = classes.length; _i < _len; _i++) {
    klass = classes[_i];
    for (prop in klass) {
      this[prop] = klass[prop];
    }
    for (prop in klass.prototype) {
      getter = klass.prototype.__lookupGetter__(prop);
      setter = klass.prototype.__lookupSetter__(prop);
      if (getter || setter) {
        if (getter) {
          this.prototype.__defineGetter__(prop, getter);
        }
        if (setter) {
          this.prototype.__defineSetter__(prop, setter);
        }
      } else {
        this.prototype[prop] = klass.prototype[prop];
      }
    }
  }
  return this;
};
if (Object.defineProperty) {
  Object.defineProperty(Function.prototype, "implements", {
    value: implements
  });
} else {
  Function.prototype.implements = implements;
}