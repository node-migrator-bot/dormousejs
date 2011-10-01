
{spawn, exec} = require 'child_process'

source_files = [
  'lib/mixin.coffee'
  'lib/assembler.coffee'
]
input = source_files.join ' '
output = 'build/dormouse.js'

task 'build', 'build dormousejs', (options) ->
  console.log "coffee --join #{output} --compile #{input}"
  exec "coffee --join #{output} --compile #{input}"
