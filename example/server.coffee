
http = require 'http'
fs = require 'fs'
url = require 'url'

server = http.createServer (req, res) ->
  parsed = url.parse req.url
  console.log 'GET #{parsed.pathname}'
  switch parsed.pathname
    when '/'
      res.writeHead 200, { 'Content-Type': 'text/html' }
      fs.readFile './test.html', (err, data) ->
        if err
          res.end 'Error reading test.html'
        else
          res.end data
    when '/dormouse.js'
      res.writeHead 200, { 'Content-Type': 'text/javascript' }
      fs.readFile '../dist/dormouse.js', (err, data) ->
        if err
          res.end 'Error reading dormouse.js'
        else
          res.end data
    else
      res.writeHead 404, { 'Content-Type': 'application/json' }
      res.end '{ "message": Invalid path requested" }'
server.listen 3778

console.log 'Server running at http://localhost:3778/'
