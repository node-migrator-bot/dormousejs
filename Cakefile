
{spawn, exec} = require 'child_process'

source_files = [
  'namespace'
  'mixin'
  'libutils'
  'connection'
  'tasks'
  'projects'
  'assembler'
]
source_files = source_files.map (fname) -> "lib/#{fname}.coffee"
input = source_files.join ' '
assembled = 'lib/assembled.js'
output = 'dormouse.js'

task 'assemble', 'assemble the dormousejs components from coffee', (options) ->
  console.log "coffee -l --join #{assembled} --compile #{input}"
  exec "coffee -l --join #{assembled} --compile #{input}", (err, stdo, stde) ->
    if (err isnt null)
      console.log 'stdout: ', stdo
      console.log 'stderr: ', stde
      console.log 'exec error: ', err

task 'build', 'wrap the assembled js with dependencies', (options) ->
  invoke 'assemble'
  console.log "ender build dormouse --output #{output}"
  exec "cd build && ender build dormouse --output #{output}", (err, stdo, stde) ->
    console.log stdo
    if (err isnt null)
      console.log 'stderr: ', stde
      console.log 'exec error: ', err

task 'clean', 'clean up assembled and built js', (options) ->
  console.log "rm #{assembled} #{output}"
  exec "rm #{assembled} #{output}"
