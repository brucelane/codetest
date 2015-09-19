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
			var generatedFreeIdKey = null;  
			mongoose.connect(config.db_connection); 
			freeIdCtrl.generateNewId(function(err, newKey) {
				if (err) return done(err);  
				generatedFreeIdKey = newKey; 
				citizenCtrl.addCitizen("test", "secretKey", "0", new Date("02-13-1986"), function(err, citizenKey) {
					if (err) return done(err); 
					should.not.exist(err);
					should.exist(citizenKey);
					citizenKey.should.equal(citizenKey);  
					citizenModel.findOne({'name':'test', 'secret':'secretKey'}, function(err, newCitizen) {
						if (err) return done(err);
						if (newCitizen == null) return done(err); 
						newCitizen.key.should.equal(generatedFreeIdKey.key); 
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

		it('should generate a valid token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/authenticate/test/secretKey')
				.expect(200)
				.end(function(err, res) { 	
					if (err) return done(err);
					var body = res.body; 
					should.exist(res.body.result); 
					should.exist(res.body.token);
					body.result.should.equal('success');  
					generatedToken = body.token; 
					done(); 
				}); 
		});
		it('should verify a valid token', function(done) { 
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.set({'x-access-token' : generatedToken }) 
				.expect(200)
				.end(function(err, res) { 	
					if (err) return done(err);
					var body = res.body;
					res.body.should.be.instanceOf(Array); 
					res.body.length.should.equal(1);  
					done(); 
				});  
		});
		it('should not generate token if user does not exists', function(done) {
			supertest('http://localhost:8080')
				.post('/api/authenticate/non_existent/a_password')
				.expect(500)
				.end(function(err, res) {
					if (err) return done(err);
					should.exist(res.error); 
					var userNotFoundError = JSON.parse(res.error.text); 
					userNotFoundError.message.should.equal('User not found'); 
					done(); 
				}); 
		}); 
		it('should reject an invalid token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.set({'x-access-token' : generatedToken + "123" }) 
				.expect(500)
				.end(function(err, res) { 	
					if (err) return done(err);
					should.exist(res.error);
					var jsonError = JSON.parse(res.error.text) ;  
					jsonError.name.should.equal('JsonWebTokenError');
					jsonError.message.should.equal('invalid signature');  
					done(); 
				}); 
		});
		it('should allow access on / without token', function(done) {
			supertest('http://localhost:8080')
				.get('/')
				.expect(200)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					responseMessage.message.should.equal('No api here, try /api instead');  
					done(); 
				}); 
		});    
		it('should allow access on /api without token', function(done) {
			supertest('http://localhost:8080')
				.get('/api')
				.expect(200)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					responseMessage.message.should.equal('Welcome to our api!');  
					done(); 
				});
		}); 
		it('should allow access on /api/authenticate without token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/authenticate/test/user')
				.expect(500)
				.end(function(err, res) {
					if (err) return done(err);
					should.exist(res.body);
					res.body.message.should.equal('User not found');  
					done(); 
				});  	
		});
		it('should not allow access on /api/citizens without token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					res.body.message.should.equal('No token provided');  
					done(); 
				}); 
		}); 
		it('should not allow access on /api/citizen without token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/citizen/123123')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					res.body.message.should.equal('No token provided');  
					done(); 
				}); 
		}); 
		it('should not allow access on /api/citizen/birth without token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/authenticate')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					res.body.message.should.equal('No token provided');  
					done(); 
				}); 
		});
 		it('should not allow access on /api/citizen/death without token', function(done) { 
			supertest('http://localhost:8080')
				.delete('/api/citizen/death/123')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					res.body.message.should.equal('No token provided');  
					done(); 
				}); 
		}); 
		it('should allow access on /api/citizens with valid token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.set({'x-access-token' : generatedToken}) 
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					should.not.exist(err);
					done(); 
				}); 
		}); 
		it('should allow access on /api/citizen with valid token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizen/' + generatedToken)
				.send({'key' : generatedToken})
				.set({'x-access-token' : generatedToken}) 
				.expect(200)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res);
					done(); 
				}); 
		}); 
		it('should allow access on /api/citizen/birth with valid token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/citizen/birth/userTest/secret/1/02-12-1986')
				.set({'x-access-token' : generatedToken}) 
				.expect(500)
				.end(function(err, res) {
					if (err) return done(err); 
					should.exist(res);
					res.unauthorized.should.equal(false); 
					should.exist(res.error); 
					var errorMessage = JSON.parse(res.error.text); 
					errorMessage.should.equal("No id available"); 
					done(); 
				}); 
		});
 		it('should allow access on /api/citizen/death with token', function(done) { 
			supertest('http://localhost:8080')
				.delete('/api/citizen/death/123')
				.set({'x-access-token' : generatedToken}) 
				.expect(500)
				.end(function(err, res) {
					if (err) return done(err); 
					should.exist(res);
					res.unauthorized.should.equal(false); 
					should.exist(res.error); 
					var errorMessage = JSON.parse(res.error.text); 
					errorMessage.should.equal("Citizen not found"); 
					done(); 
				}); 
		}); 
		it('should not add a birth with invalid date', function(done) {
			freeIdCtrl.generateNewId(function(err, newKey) {
				if (err) return done(err); 
				generatedFreeIdKey = newKey.key; 
			}); 
			 supertest('http://localhost:8080')
				.post('/api/citizen/birth/userTest/secret/1/19861202')
				.set({'x-access-token' : generatedToken}) 
				.expect(500)
				.end(function(err, res) {
					if (err) return done(err);
	 				should.exist(res.error);
					should.exist(res.error.text);
					var errorMessage = JSON.parse(res.error.text);  
					res.unauthorized.should.equal(false); 
					errorMessage.should.equal('Invalid date, format: MM-DD-YYYY'); 
					done(); 
			}); 
		});
	it('should add a birth', function(done) {
			 supertest('http://localhost:8080')
				.post('/api/citizen/birth/userTest/secret/1/02-12-1986')
				.set({'x-access-token' : generatedToken}) 
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
	 				should.exist(res);
					should.exist(res.body);
					res.body.result.should.equal(generatedFreeIdKey);   
					res.unauthorized.should.equal(false); 
					done(); 
			}); 
		});
		it('should get citizen from /api/citizen with valid token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizen/' + generatedFreeIdKey)
				.set({'x-access-token' : generatedToken}) 
				.expect(200)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res);
					done(); 
				}); 
		});
		it('should add a death', function(done) { 
			supertest('http://localhost:8080')
				.delete('/api/citizen/death/' + generatedFreeIdKey)
				.set({'x-access-token' : generatedToken}) 
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err); 
					should.exist(res);
					res.unauthorized.should.equal(false); 	
					res.body.result.should.equal(1);  
					done(); 
				}); 
		});    
	});   
}); 
