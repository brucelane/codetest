//******************
// Dependencies **** 
//****************** 
var should = require('should'); 
var mongoose = require('mongoose'); 
var citizenCtrl = require('../../controllers/Citizen.js'); 
var freeIdCtrl = require('../../controllers/FreeId.js'); 
var citizenModel = mongoose.model('Citizen'); 
var config = require('../../config/config.js'); 

//******************* 
// Test cases ******* 
//******************* 
describe('Citizens', function() {
	before(function(done) {
		mongoose.connect(config.db_connection); 
		done(); 
	}); 
	after(function(done) {
		mongoose.disconnect(); 
		done(); 
	}); 
	describe('Add citizen birth when no setup loaded' , function() {
		it('Should return an empty array of citizen births when retrieving all citizen births', function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				should.not.exist(err);  
				should.exist(citizens); 
				citizens.should.be.an.instanceOf(Array); 
				citizens.length.should.equal(0); 
				done(); 
			});  
		}); 
		it('should return an error when searching by citizen empty key', function(done) {
			citizenCtrl.getCitizen("", function(err, citizen) {
				should.exist(err);
				should.not.exist(citizen); 
				err.should.be.an.instanceOf(Error).and.have.property('message'); ; 
				err.message.should.equal("No key defined");
				done(); 
			}); 
		}); 
		it('should return an error when deleting citizen by empty key', function(done) {
			citizenCtrl.delCitizen("", function(err, deletedCitizens) {
				should.exist(err);
				should.not.exist(deletedCitizens); 
				err.should.be.an.instanceOf(Error).and.have.property('message'); ; 
				err.message.should.equal("No key defined");
				done(); 
			}); 
		});
		it('should return an error when searching by citizen key == null  key', function(done) {
			citizenCtrl.getCitizen("", function(err, citizen) {
				should.exist(err);
				should.not.exist(citizen); 
				err.should.be.an.instanceOf(Error).and.have.property('message'); ; 
				err.message.should.equal("No key defined");
				done(); 
			}); 
		}); 
		it('should return an error when deleting citizen key == null', function(done) {
			citizenCtrl.delCitizen("", function(err, deletedCitizens) {
				should.exist(err);
				should.not.exist(deletedCitizens); 
				err.should.be.an.instanceOf(Error).and.have.property('message'); ; 
				err.message.should.equal("No key defined");
				done(); 
			}); 
		}); 
 
		it('should return an empty citizen when key does not exist', function(done) {
			citizenCtrl.getCitizen("123", function(err, citizen) {
				should.not.exist(err); 
				should.not.exist(citizen); 
				done();  
			}); 
		}); 
		it('should return an error when deleting citizen and key does not exist', function(done) {
			citizenCtrl.delCitizen("123", function(err, deletedCitizens) {
				should.exist(err);
				err.should.be.an.instanceOf(Error).and.have.property('message'); ; 
				err.message.should.equal("Citizen not found");
				done(); 
			}); 

		}); 
		it('should not add a citizen birth because there aren\'t free id\'s', function(done) {
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
		before(function(done) {
			freeIdCtrl.generateNewId(function(err, newKey) {
				if (err) throw(err); 
				done(); 
			}); 
		}); 

		after(function(done) {
			citizenCtrl.deleteAll(function(err) {
				if (err) done(err);
				freeIdCtrl.delAllFreeIdKeys(function(err, totalRemovedKeys) { 
					if (err) done(err); 
					done(); 
				});
			});  
		}); 

		it('should add one citizen', function(done) {
			var citizenDataModel = new citizenModel({
				name : "test" 
				,secret : "secretKey" 
				,sex : "0"
				,birth : "12/02/1986"
			}); 

			citizenCtrl.addCitizen(citizenDataModel, function(err, citizenKey) {
				should.not.exist(err);
				should.exist(citizenKey); 
				done(); 
			}); 
		}); 
		it('should return an array of citizens when retrieving all citizen births', function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				should.not.exist(err); 
				citizens.should.be.an.instanceOf(Array);
				citizens[0].name.should.equal('test'); 
				done(); 
			}); 	
		}); 
		it('should return a citizen when searching by citizen key', function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				citizenCtrl.getCitizen(citizens[0].key, function(err, citizen) {
					should.not.exist(err); 
					citizen.key.should.equal(citizens[0].key); 
					done(); 	
				}); 	
			}); 
		}); 
		it('should delete citizen by key', function(done) {	
			citizenCtrl.getCitizens(function(err, citizens) {
				citizenCtrl.delCitizen(citizens[0].key, function(err, totalCitizensRemoved) {
					should.not.exist(err); 
					totalCitizensRemoved.should.equal(1); 
					done(); 	
				}); 	
			}); 
		}); 
		it('after delete citizen, key must be pushed back to FreeId\'s collection', function(done) {
			freeIdCtrl.getIds(function(err, ids) {
				should.not.exist(err); 
				ids.should.be.instanceOf(Array);
				ids.length.should.equal(1);  
				done(); 
			}); 
		});  
	});
	describe('Add citizen birth when setup is loaded and data is not format compliant', function() {
		/* before(function(done) {
			var citizenDataModel = new citizenModel({
				name : "test" 
				,secret : "secretKey" 
				,sex : "0"
				,birth : "12/02/1986"
			});
			citizenCtrl.addCitizen(citizenDataModel, function(err, citizenKey) {
				should.not.exist(err);
				should.exist(citizenKey);  
				done(); 
			});  
		}); 

		after(function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				citizenCtrl.getCitizen(citizens[0].key, function(err, citizen) {
					should.not.exist(err); 
					citizen.key.should.equal(citizens[0].key); 
					done(); 	
				}); 	
			}); 
		});
 		*/ 
		it('should return an Error() when searching by citizen with empty key', function(done) {
			citizenCtrl.getCitizen("", function(err, citizen) {
				should.exist(err); 
				err.message.should.equal("No key defined");
				done();  
			}); 
		});
		it('should return an Error() when searching by citizen null key', function(done) {
			citizenCtrl.getCitizen("", function(err, citizen) {
				should.exist(err); 
				err.message.should.equal("No key defined"); 
				done(); 
			}); 
		});
		it('should return an Error() when deleting by citizen empty key', function(done) {
			citizenCtrl.delCitizen("", function(err, citizen) {
				should.exist(err); 
				err.message.should.equal("No key defined");
				done();  
			}); 
		});
		it('should return an Error() when deleting by citizen null key', function(done) {
			citizenCtrl.delCitizen(null, function(err, citizen) {
				should.exist(err); 
				err.message.should.equal("No key defined"); 
				done(); 
			}); 
		});   
		xit('should not add citizen birth when free id available and citizen data is not format compliant', function(done) {
			// Try date as other format 
			done(); 
		});
		xit('Should handle really big format fields', function(done) {
			done(); 
		});  

	});   
}); 
