var mongoose = require("mongoose");
mongoose.connect("mongodb://harish:harish05!(@ds037252.mongolab.com:37252/flights");

module.exports = mongoose.connection;