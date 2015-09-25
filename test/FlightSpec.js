var app = require('./helpers/app');

var should = require('should'),
    supertest = require('supertest');
    
describe('flights', function() {
    it('should return correct info of flight 18', function(done) {
        supertest(app)
        .get('/flight/18')
        .expect(200)
        .end(function(err,res) {
            res.status.should.equal(200);
            done();
        });
    });
    
    it('should return 404 for invalid flight', function(done) {
        supertest(app)
        .get('/flight/1')
        .expect(404)
        .end(function(err,res) {
            res.status.should.equal(404);
            done();
        });
    });
    
    it('should mark flight 18 as arriver', function(done) {
        supertest(app)
        .put('/flight/18/arrived')
        .expect(200)
        .end(function(err,res) {
            res.status.should.equal(200);
            res.body.status.should.equal('done');
            
            supertest(app)
            .get('/flight/18')
            .expect(200)
            .end(function(err,res) {
                res.status.should.equal(200);
                res.body.arrival.should.not.equal(undefined);
                done();
            });
        });
    });
});