
/*
 * GET home page.
 */

var FlightSchema = require("../schemas/flights");
var Emitter = require("events").EventEmitter;

var flightEmitter = new Emitter();
flightEmitter.on("arrival", function(flight) {
  var record = new FlightSchema(flight.getInfo());
  record.save(function(err) {
    if (err) {
      console.log(err);
    }
  });
});

module.exports = function(flights) {
  var flight = require('../flight');
  
  for (var number in flights) {
    flights[number] = flight(flights[number]);
  }
  
  var functions = {};
  functions.flight = function(req, res){
    var number = req.param('number');
    req.session.lastNumber = number;
    if (typeof flights[number] === 'undefined') {
      res.status(404).json({status: 'Not Found'})
    } else {
      res.json(flights[number].getInfo());
    }
  };
  
  functions.arrived = function(req, res){
    var number = req.param('number');
    if (typeof flights[number] === 'undefined') {
      res.status(404).json({status: 'Not Found'})
    } else {
      flights[number].triggerArrival();
      flightEmitter.emit("arrival", flights[number]);
      res.json({status: "success"});
    }
  };
  
  functions.list = function(req, res) {
    res.render("list", {
      title: "All Flight",
      flights: flights
    });
  };
  
  functions.arrivals = function(req, res) {
    FlightSchema.find().setOptions({sort: {arrival: -1}}).exec(function(err, arrivals) {
      if (err) {
          console.log(err);
          res.status(500).json({status: "failure"});
        } else {
          res.render("arrivals", {
            title: "Arrivals",
            arrivals: arrivals,
            lastNumber: req.session.lastNumber
          });
        }
    });
  };
  
  functions.login = function(req, res) {
    res.render("login", {title: "Log in"});
  };
  
  functions.user = function(req, res) {
    if (req.session.passport === undefined) {
      res.redirect("/login");
    } else {
      res.render("user", {title: "Welcone!", user: req.session.passport.user});
    }
  };
  
  functions.logout = function(req, res) {
    req.session.destroy();
    res.redirect("/login");
  };
  
  functions.error = function(req, res) {
    res.status(404).json({status: "Not Found!"});
  };
  
  return functions;
};