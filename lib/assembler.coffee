
###
Top level Dormouse
###

class Dormouse
  @implements Tasks
  # tasks is a mixin

root = this
if (typeof module isnt 'undefined' and module.exports)
    module.exports = Dormouse
else
    root.$dm = Dormouse
