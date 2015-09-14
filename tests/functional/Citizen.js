//******************
// Dependencies **** 
//****************** 
var should = require('should'); 
var mongoose = require('mongoose'); 
var citizenCtrl = require('../../controllers/Citizen.js'); 
var freeIdCtrl = require('../../controllers/FreeId.js'); 
var citizenModel = mongoose.model('Citizen'); 
var config = require('../../config/config.js'); 
mongoose.connect(config.db_connection); 

//******************* 
// Test cases ******* 
//******************* 
describe('Citizen births', function() {
	describe('Add/Get citizen' , function() {
		xit('Should return an empty array of citizen births when retrieving all citizen births', function(done) {
			});   
	});
});  
