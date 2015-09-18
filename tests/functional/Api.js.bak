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
					if (err) return done(err);
					should.exist(res.error); 
					var userNotFoundError = JSON.parse(res.error.text); 
					userNotFoundError.should.equal('User not found'); 
					done(); 
				}); 
		}); 
		it('Should reject an invalid token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.send({'token' : generatedToken + "123" }) 
				.expect(500)
				.end(function(err, res) { 	
					if (err) return done(err);
					should.exist(res.error);
					var jsonError = JSON.parse( res.error.text ) ;  
					jsonError.name.should.equal('JsonWebTokenError');
					jsonError.message.should.equal('invalid signature');  
					done(); 
				}); 
		});
		it('Should allow access on / without token', function(done) {
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
		it('Should allow access on /api without token', function(done) {
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
		it('Should allow access on /api/authenticate without token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/authenticate')
				.expect(403)
				.end(function(err, res) {
					if (err) return done(err);
					should.exist(res.body);
					res.body.message.should.equal('No user data provided');  
					done(); 
				});  	
		});
		it('Should not allow access on /api/citizens without token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizens')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					responseMessage.message.should.equal('No token provided');  
					done(); 
				}); 
		}); 
		it('Should not allow access on /api/citizen without token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizen')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					responseMessage.message.should.equal('No token provided');  
					done(); 
				}); 
		}); 
		it('Should not allow access on /api/citizen/birth without token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/authenticate')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					responseMessage.message.should.equal('No token provided');  
					done(); 
				}); 
		});
 		it('Should not allow access on /api/citizen/death without token', function(done) { 
			supertest('http://localhost:8080')
				.get('/api/authenticate')
				.expect(403)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res.text);
					var responseMessage = JSON.parse(res.text); 
					responseMessage.message.should.equal('No token provided');  
					done(); 
				}); 
		}); 
		it('Should allow access on /api/citizens with valid token', function(done) {
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
		it('Should allow access on /api/citizen with valid token', function(done) {
			supertest('http://localhost:8080')
				.get('/api/citizen')
				.send({'key' : generatedToken})
				.set({'x-access-token' : generatedToken}) 
				.expect(200)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res);
					done(); 
				}); 
		}); 
		it('Should allow access on /api/citizen/birth with valid token', function(done) {
			supertest('http://localhost:8080')
				.post('/api/citizen/birth')
				.set({'x-access-token' : generatedToken}) 
				.expect(500)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res);
					done(); 
				}); 
		});
 		it('Should allow access on /api/citizen/death with token', function(done) { 
			supertest('http://localhost:8080')
				.delete('/api/citizen/death')
				.set({'x-access-token' : generatedToken}) 
				.expect(500)
				.end(function(err, res) { 
					if (err) return done(err);
					should.exist(res);
					done(); 
				}); 
		});  
 
	});   
}); 
