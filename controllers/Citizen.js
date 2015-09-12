//****************
// Dependencies***
//**************** 

var mongoose = require('mongoose'); 
var citizen = mongoose.model('Citizen');

//************************** 
// Business Logic **********
//************************** 

var citizensFindAll = function( cb ) {
	citizen.find( function ( err , citizens ) {
		if (err) cb(err, null); 
		cb(null, citizens);   
	}); 	
}; 

var citizenAdd = function(citizenData, cb ) {
	citizenData.save( function ( err , key ) {
		if (err) cb(err, null); 
		cb(null, key); 	
	}); 
};

var citizenDelete = function(citizenKey, cb ) {
	citizen.remove({ key : citizenKey }, function(err , removedDocs) {
		if (err) cb(err, null); 
		cb(null, removedDocs); 
	}); 
}; 

module.exports = { getCitizens : citizensFindAll , addCitizen : citizenAdd , delCitizen : citizenDelete }; 
 
