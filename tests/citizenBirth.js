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
	describe('Add citizen birth' , function() {
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
}); 
