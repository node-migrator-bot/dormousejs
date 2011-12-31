**dormousejs** is a javascript library to help access the
[dormouse](http://dormou.se) crowdsourcing platform's API.

It is compatible with the **node.js** engine, and can be installed
in one line

    npm install dormouse

It can also be used in *modern* **browsers** by including the bundled
file found in `dist/dormouse.js`

### Features

- Connects to specifiable dormouse server
- queues tasks
- receives responses
- Includes a task Query API
- Rendering of task templates using the {{ [mustache.js](http://mustache.github.com/) }} style

### First steps

- If client-side, use the global `$dm` object
- If server-side, `require('dormouse')` to get the object
- Use the setter methods, `$dm.server(...)` and `$dm.api_key(...)` to access Dormouse
- Start playing with tasks from your favorite project using `$dm.getTasks(...)`
