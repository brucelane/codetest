//******************
// Dependencies **** 
//****************** 
var should = require('should'); 
var mongoose = require('mongoose');
var citizenCtrl = require('../../controllers/Citizen.js'); 
var citizenModel = mongoose.model('Citizen'); 
var freeIdCtrl = require('../../controllers/FreeId.js');  
var authCtrl = require('../../controllers/Auth.js'); 
var config = require('../../config/config.js'); 
 
//******************* 
// Test cases ******* 
//******************* 
describe('FreeId', function() {
	before(function(done) {
		mongoose.connect(config.db_connection); 
		done(); 
	}); 	
	after(function(done) {
		mongoose.disconnect(); 
		done();
	});
	describe('Generate a valid token when a user exists' , function() {
		before(function(done) {
			freeIdCtrl.generateNewId(function(err, newKey) {
				if (err) throw(err); 
			citizenCtrl.addCitizen("test","secretKey","0",new Date("02-12-2986"), function(err, citizenKey) {
					if (err) return done(err); 
					should.exist(citizenKey); 
					done(); 
				});   
			});
		}); 

		after(function(done) {
			citizenCtrl.deleteAll(function(err, totalRemovedCitizens) {
				if (err) done(err);
				freeIdCtrl.delAllFreeIdKeys(function(err, totalRemovedKeys) { 
					if (err) return done(err); 
					done(); 
				});
			});  
		}); 

		it('should generate a valid token', function(done) { 
			 authCtrl.tryToSignUser('test', 'secretKey',  
				function(citizen) { return done(); }
			) 
		})
		it('should validate a valid token', function(done) { 
			authCtrl.tryToSignUser('test', 'secretKey').then(function(token){
				authCtrl.validateUserToken(token.token, function(err, decodedToken) {
					done(); 
				}); 
			})	
			.reject(done); 
		});
		it('should not generate token if user does not exists', function(done) {
			var a = authCtrl.tryToSignUser('username', 'secretKey').then(function(token) { 
					console.log("AAAAAA"); 
					should.exist(err); 
					err.message.should.equal("User not found");
					done();  
			})
			.reject(function(err){ console.log(err); done(err); }); 
		}); 
		it('should not validate an invalid token', function(done) {
			authCtrl.validateUserToken("123456", function(err, decodedToken) {
				should.exist(err); 
				err.message.should.equal("jwt malformed"); 
				done(); 
			}); 	
		});   
	});   
});
