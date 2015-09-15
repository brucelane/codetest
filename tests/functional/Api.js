//******************
// Dependencies **** 
//****************** 
var should = require('should'); 
var supertest = require('supertest'); 
var mongoose = require('mongoose'); 
var freeIdCtrl = require('../../controllers/FreeId.js'); 
var citizenCtrl = require('../../controllers/Citizen.js'); 
var config = require('../../config/config.js'); 
var citizenModel = mongoose.model('Citizen'); 


//******************* 
// Test cases ******* 
//******************* 
describe('Make request to /api', function() {
	describe('/api/authenticate when a user exists' , function() {
		before(function(done) { 
			var generatedToken = null; 
			mongoose.connect(config.db_connection); 
			freeIdCtrl.generateNewId(function(err, newKey) {
				if (err) return done(err);  
				var citizenDataModel = new citizenModel({
					name : "test" 
					,secret : "secretKey" 
					,sex : "0"
					,birth : "12/02/1986"
				}); 
				citizenCtrl.addCitizen(citizenDataModel, function(err, isInserted) {
					if (err) return done(err); 
					should.not.exist(err);
					isInserted.should.equal(1);
					citizenModel.findOne({'name':'test', 'secret':'secretKey'}, function(err, citizen) {
						if (err) return done(err);
						if (citizen == null) return done(err); 
						done(); 
					});  
				});  
 
			});
		}); 

		after(function(done) {
			citizenCtrl.deleteAll(function(err) {
				if (err) done(err); 
				freeIdCtrl.delAllFreeIdKeys(function(err, totalRemovedKeys) { 
					if (err) return done(err); 
					mongoose.disconnect();
					done(); 
				}); 
			});  
		}); 

		it('Should generate a valid token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/authenticate')
				.send({'user' : 'test', 'passwd' : 'secretKey'}) 
				.expect(200)
				.end(function(err, res) { 	
					if (err) return done(err);
					var body = res.body; 
					should.exist(body.result); 
					should.exist(body.token);
					body.result.should.equal('success');  
					generatedToken = body.token; 
					done(); 
				}); 
		});
		it('Should verify a valid token', function(done) { 
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.send({'token' : generatedToken }) 
				.expect(200)
				.end(function(err, res) { 	
					if (err) return done(err);
					var body = res.body;
					body.should.be.instanceOf(Array); 
					body.length.should.equal(1);  
					done(); 
				});  
		});
		it('Should not generate token if user does not exists', function(done) {
			supertest('http://localhost:8080')
				.post('/api/authenticate')
				.send({'user' : 'non_existent', 'passwd' : 'a_password'}) 
				.expect(500)
				.end(function(err, res) {
					should.exist(res.error); 
					var userNotFoundError = JSON.parse(res.error.text); 
					userNotFoundError.should.equal('User not found'); 
					done(); 
				}); 
		}); 
		it('Should not verify and invalid token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.send({'token' : generatedToken + "123" }) 
				.expect(200)
				.end(function(err, res) { 	
					should.exist(res.error);
					var jsonError = JSON.parse( res.error.text ) ;  
					jsonError.name.should.equal('JsonWebTokenError');
					jsonError.message.should.equal('invalid signature');  
					done(); 
				}); 
		});   
	});   
}); 
