
/**
 * Module dependencies.
 */

module.exports = function(flights, db) {
  var express = require('express');
  var mongoStore = require("connect-mongo")(express);
  var passport = require("./auth");
  var routes = require('./routes')(flights);
  var path = require('path');
  var app = express();
  
  // all environments
  //app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "keyboard cat",
    store: new mongoStore({
      mongooseConnection: db
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(function(req,res,next) {
    res.set('X-Powered-By', 'Flight Tracker');
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res) {
    res.status(404).render('404', { title: '404 - File Not Found!' });
  });
  
  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
  
  app.get('/', routes.list);
  app.get('/flight/:number', routes.flight);
  app.put('/flight/:number/arrived', routes.arrived);
  app.get('/arrivals', routes.arrivals);
  app.get("/login", routes.login);
  app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/user"
  }));
  app.get("/user", routes.user);
  app.get("/logout", routes.logout);
  //app.get("/*", routes.error);
  
  return app;
};
