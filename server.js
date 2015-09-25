#!/usr/bin/env node

var http = require('http'),
    flights = require('./data'),
    db = require('./db'),
    repl = require("repl"),
    app = require('./app')(flights, db),
    port = process.env.OPENSHIFT_NODEJS_PORT || 3000,
    ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

http.createServer(app).listen(port, ip, function() {
  console.log('Express server listening on port ' + port);
});

var prompt = repl.start({prompt: "airline> "});
prompt.context.data = flights;