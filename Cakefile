
{spawn, exec} = require 'child_process'
fs = require 'fs'
path = require 'path'

coffeelib = 'src'
jslib = 'lib'
jsdist = 'dist/dormouse.js'

task 'clean', 'clean up assembled and built js', (options) ->
  fs.unlinkSync jsdist if path.existsSync jsdist
  files = fs.readdirSync "#{jslib}"
  for file in files
    if '.js' is path.extname file
      fs.unlinkSync path.join jslib, file

task 'compile', 'compile the coffeescript in src/ into javascript in lib/', (options) ->
  invoke 'clean'
  compile_files()

task 'wrapup', "wrap the 'dormouse' module and its dependancies into dist/dormouse.js", (options) ->
  invoke 'clean'
  compile_files () ->
    exec "cd dist && browserify -r dormouse browser.js", (err, stdo, stde) ->
      if (err)
        console.log 'browserify error', err
        console.log 'stderr', stde
        process.exit 1
      fs.writeFile "#{jsdist}", stdo, 'utf8', (err) ->
        if (err)
          console.log "#{jsdist} write error", err
          process.exit 1

task 'runserver', 'run the test code node.js server', (options) ->
  compile_files ->
    server = spawn 'coffee', [ 'example/server.coffee' ]
    server.stdout.on 'data', (data) ->
      console.log data.toString().trim()
    server.stderr.on 'data', (data) ->
      console.error data.toString().trim()
    server.on 'exit', (code, signal) ->
      process.exit code

task 'docs', 'build docs for .coffee files using docco', (options) ->
  srcfiles = []
  files = fs.readdirSync "#{coffeelib}"
  for file in files
    if '.coffee' is path.extname file
      srcfiles.push path.join coffeelib, file
  docco = spawn 'docco', srcfiles
  docco.stdout.on 'data', (data) ->
    console.log data.toString().trim()
  docco.stderr.on 'data', (data) ->
    console.log data.toString().trim()
  docco.on 'exit', (code, signal) ->
    process.exit code

compile_files = (cb) ->
  exec "coffee --compile --lint --bare --output #{jslib} #{coffeelib}", (err, stdo, stde) ->
    if (err)
      console.log 'coffeescript compilation error', err
      console.log 'stderr', stde
      process.exit 1
    cb() if cb
