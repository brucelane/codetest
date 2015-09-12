var mongoose = require('mongoose'); 
var citizen = mongoose.model('Citizen');

var findAllCitizens = function(cb) {
	citizen.find( function ( err , citizens ) {
		if (err) cb(err, null); 
		cb(null, citizens);   
	}); 	
}; 

module.exports = { getCitizens : findAllCitizens };  
