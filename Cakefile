
{spawn, exec} = require 'child_process'

source_files = [
  'lib/test.coffee'
]
input = source_files.join ' '
output = 'build/dormouse.js'

task 'build', 'build dormousejs', (options) ->
  exec "coffee --join #{output} --compile #{input}"
