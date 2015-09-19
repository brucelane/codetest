//******************
// Dependencies **** 
//****************** 
var mongoose = require('mongoose'); 
var should = require('should'); 
var citizenCtrl = require('../../controllers/Citizen.js'); 
var freeIdCtrl = require('../../controllers/FreeId.js'); 
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
		citizenCtrl.deleteAll(done); 
		freeIdCtrl.delAllFreeIdKeys(done); 
		mongoose.disconnect(); 
		done(); 
	}); 
	describe('Add citizen birth when no setup loaded' , function() {
		it('Should return an empty array of citizen births when retrieving all citizen births', function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				if (err) return done(err); 
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
				if (err) return done(err); 
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
			citizenCtrl.addCitizen("test","secretKey","0",new Date("02-12-29186"), function(err, citizen) {
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
				if (err) done(err); 
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
			citizenCtrl.addCitizen("test","secretKey","0",new Date("02-12-2986"), function(err, citizenKey) {
				if (err) return done(err); 
				should.exist(citizenKey); 
				done(); 
			}); 
		}); 
		it('should return an array of citizens when retrieving all citizen births', function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				if (err) done(err); 
				citizens.should.be.an.instanceOf(Array);
				citizens[0].name.should.equal('test'); 
				done(); 
			}); 	
		}); 
		it('should return a citizen when searching by citizen key', function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				citizenCtrl.getCitizen(citizens[0].key, function(err, citizen) {
					if (err) done(err); 
					citizen.key.should.equal(citizens[0].key); 
					done(); 	
				}); 	
			}); 
		}); 
		it('should delete citizen by key', function(done) {	
			citizenCtrl.getCitizens(function(err, citizens) {
				citizenCtrl.delCitizen(citizens[0].key, function(err, totalCitizensRemoved) {
					if (err) done(err); 
					totalCitizensRemoved.should.equal(1); 
					done(); 	
				}); 	
			}); 
		}); 
		it('after delete citizen, key must be pushed back to FreeId\'s collection', function(done) {
			freeIdCtrl.getIds(function(err, ids) {
				if (err) done(err); 
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
				,birth : new Date("02-12-1986")
			});
			citizenCtrl.addCitizen("test","secretKey","0",new Date("02-12-2986"), function(err, citizenKey) {
				if (err) done(err); 
				should.exist(citizenKey);  
				done(); 
			});  
		}); 

		after(function(done) {
			citizenCtrl.getCitizens(function(err, citizens) {
				citizenCtrl.getCitizen(citizens[0].key, function(err, citizen) {
					if (err) done(err); 
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
		it('should return true for valid month', function(done) {
			return done((!citizenCtrl.checkDate(new Date("01-01-1900"))?new Error("Invalid date"):"")); 	
			return done((!citizenCtrl.checkDate(new Date("09-01-1900"))?new Error("Invalid date"):"")); 
			return done((!citizenCtrl.checkDate(new Date("10-01-1900"))?new Error("Invalid date"):""));
			return done((!citizenCtrl.checkDate(new Date("12-01-1900"))?new Error("Invalid date"):"")); 	
 			done(); 	
		});    
		it('should return true for valid day', function(done) {
			return done((!citizenCtrl.checkDate(new Date("01-01-1900"))?new Error("Invalid date"):"")); 	
			return done((!citizenCtrl.checkDate(new Date("09-09-1900"))?new Error("Invalid date"):"")); 
			return done((!citizenCtrl.checkDate(new Date("10-10-1900"))?new Error("Invalid date"):""));
			return done((!citizenCtrl.checkDate(new Date("12-19-1900"))?new Error("Invalid date"):"")); 	
			return done((!citizenCtrl.checkDate(new Date("12-20-1900"))?new Error("Invalid date"):"")); 	
			return done((!citizenCtrl.checkDate(new Date("12-29-1900"))?new Error("Invalid date"):"")); 	
			return done((!citizenCtrl.checkDate(new Date("12-30-1900"))?new Error("Invalid date"):"")); 	
			return done((!citizenCtrl.checkDate(new Date("12-31-1900"))?new Error("Invalid date"):"")); 	
 			done(); 	
		});   
 		it('should return true for valid year', function(done) {
			return done((!citizenCtrl.checkDate(new Date("01-01-1900"))?new Error("Invalid date"):"")); 	
			return done((!citizenCtrl.checkDate(new Date("09-09-1999"))?new Error("Invalid date"):"")); 
			return done((!citizenCtrl.checkDate(new Date("10-10-2000"))?new Error("Invalid date"):""));
			return done((!citizenCtrl.checkDate(new Date("12-19-2999"))?new Error("Invalid date"):"")); 	
 			done(); 	
		});   
 		it('should return false for invalid month', function(done) {
			return done((citizenCtrl.checkDate(new Date("00-01-1900"))?new Error("Invalid date"):"")); 	
			return done((citizenCtrl.checkDate(new Date("13-01-1900"))?new Error("Invalid date"):"")); 
 			done(); 	
		});    
		it('should return false for invalid day', function(done) {
			return done((citizenCtrl.checkDate(new Date("01-00-1900"))?new Error("Invalid date"):"")); 	
			return done((citizenCtrl.checkDate(new Date("09-32-1900"))?new Error("Invalid date"):"")); 
 			done(); 	
		});   
 		it('should return false for invalid year', function(done) {
			return done((citizenCtrl.checkDate(new Date("01-01-1800"))?new Error("Invalid date"):"")); 	
			return done((citizenCtrl.checkDate(new Date("09-09-3000"))?new Error("Invalid date"):"")); 
 			done(); 	
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
