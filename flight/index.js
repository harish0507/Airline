var Flight = function() {
    this.data = {
        number: null,
        origin: null,
        destination: null,
        arrival: null
    };
    this.fill = function(info) {
        for (var prop in this.data) {
            if (this.data[prop] !== 'undefined') {
                this.data[prop] = info[prop];
            }
        }
    };
    this.triggerArrival = function() {
        this.data.arrival = Date.now();
    };
    this.getInfo = function() {
        return this.data;
    };
};

module.exports = function(info) {
    var instance = new Flight();
    instance.fill(info);
    return instance;
};