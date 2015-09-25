#!/usr/bin/env node

var http = require('http'),
    flights = require('./data'),
    db = require('./db'),
    repl = require("repl"),
    app = require('./app')(flights, db);

http.createServer(app).listen(app.get("port"), app.get("ip"), function() {
  console.log('Express server listening on port ' + app.get("port"));
});

var prompt = repl.start({prompt: "airline> "});
prompt.context.data = flights;