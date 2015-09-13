//******************
// Dependencies **** 
//****************** 
var should = require('should'); 
var mongoose = require('mongoose'); 
var citizenCtrl = require('../controllers/Citizen.js'); 
var citizenModel = mongoose.model('Citizen'); 
var config = require('../config/config.js'); 
mongoose.connect(config.db_connection); 

//******************* 
// Test cases ******* 
//******************* 
describe('Citizen births', function() {
	describe('Add citizen birth when no setup loaded' , function() {
		it('Should return an empty array of citizen births when retrieving all citizen births', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should return an empty citizen when searching by citizen key', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should return an error when deleting citizen by key', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should not add a citizen birth because there aren\'t free id\'s', function(done) {
			var citizenDataModel = new citizenModel({
				name : "test" 
				,secret : "secretKey" 
				,sex : "0"
				,birth : "12/02/1986"
			}); 
			citizenCtrl.addCitizen(citizenDataModel, function(err, citizen) {
				should.exist(err); 
				err.should.be.an.instanceOf(Error).and.have.property('message'); ; 
				err.message.should.equal("No id available");  
				done(); 
			}); 
		}); 
	});
	describe('Add citizen birth when setup loaded' , function() {
		it('Should return an array of citizen births when retrieving all citizen births', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should return a citizen when searching by citizen key', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should return an when deleting citizen by key', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should add citizen birth when free id available and citizen data is format compliant', function(done) {
			done(new Error("")); 
		}); 
	});
	describe('Add citizen birth when setup is loaded and data is not format compliant', function() {
		it('Should return an Error() when searching by citizen key number', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should return an Error() when deleting citizen by key number', function(done) {
			done(new Error("Not implemented")); 
		}); 
		it('Should not add citizen birth when free id available and citizen data is not format compliant', function(done) {
			// Try date as other format 
			done(new Error("")); 
		}); 

	});   
}); 
