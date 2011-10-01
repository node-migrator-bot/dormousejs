
{spawn, exec} = require 'child_process'

source_files = [
  'namespace'
  'mixin'
  'assembler'
]
source_files = source_files.map (fname) -> "lib/#{fname}.coffee"
input = source_files.join ' '
output = 'build/dormouse.js'

task 'build', 'build dormousejs', (options) ->
  console.log "coffee --join #{output} --compile #{input}"
  exec "coffee --join #{output} --compile #{input}"
