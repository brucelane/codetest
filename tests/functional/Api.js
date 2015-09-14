//******************
// Dependencies **** 
//****************** 
var should = require('should'); 

//******************* 
// Test cases ******* 
//******************* 
describe('Make request to /', function() {
	describe('Generate a valid token when a user exists' , function() {
		before(function(done) {
			freeIdCtrl.generateNewId(function(err, newKey) {
				if (err) throw(err); 
				var citizenDataModel = new citizenModel({
					name : "test" 
					,secret : "secretKey" 
					,sex : "0"
					,birth : "12/02/1986"
				}); 
				citizenCtrl.addCitizen(citizenDataModel, function(err, isInserted) {
					should.not.exist(err);
					isInserted.should.equal(1); 
					done(); 
				});  
 
			});
		}); 

		after(function(done) {
			citizenCtrl.deleteAll(function(err, totalRemovedCitizens) {
				if (err) throw(err);
				freeIdCtrl.delAllFreeIdKeys(function(err, totalRemovedKeys) { 
					if (err) throw(err); 
					done(); 
				});
			});  
		}); 

		it('Should generate a valid token', function(done) {
			authCtrl.tryToSignUser('test', 'secretKey', function(err, token) {	
				should.not.exist(err); 
				done(); 
			}); 
		});
		it('Should verify a valid token', function(done) { 
			authCtrl.tryToSignUser('test', 'secretKey', function(err, token) {
					if (err) return done(err); 
				authCtrl.validateUserToken(token.token, function(err, decodedToken) {
					if(err) return done(err); 
					done(); 
				}); 
			}); 
		});
		it('Should not generate token if user does not exists', function(done) {
			authCtrl.tryToSignUser('username', 'secretKey', function(err, token) { 
					should.exist(err); 
					err.message.should.equal("User not found");
					done();  
			});
		}); 
		it('Should not verify and invalid token', function(done) {
			authCtrl.validateUserToken("123456", function(err, decodedToken) {
				should.exist(err); 
				err.message.should.equal("jwt malformed"); 
				done(); 
			}); 	
		});   
	});   
}); 
