
{spawn, exec} = require 'child_process'
fs = require 'fs'

output = 'dist/dormouse.js'

task 'build', 'wrap js with dependencies', (options) ->
  invoke 'clean'
  console.log "browserify -r dormouse -o #{output} dist/init.js"
  exec "cd dist && browserify -r dormouse init.js", (err, stdo, stde) ->
    if (err)
      console.log 'browserify error ', err
      console.log 'stderr ', stde
      return
    fs.writeFile "#{output}", stdo, 'utf8', (err) ->
      if (err)
        console.log 'write error ', err
      else
        console.log "build success! #{output}"

task 'clean', 'clean up assembled and built js', (options) ->
  console.log "rm #{output}"
  exec "rm #{output}"
