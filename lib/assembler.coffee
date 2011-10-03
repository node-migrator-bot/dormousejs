
###
Top level Dormouse
###

class Dormouse
  @implements Tasks, Projects
  # tasks is a mixin

if (typeof module isnt 'undefined' and module.exports)
    module.exports = Dormouse
else
    window.$dm = Dormouse
